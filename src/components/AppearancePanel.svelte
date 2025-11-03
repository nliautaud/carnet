<script>
  import { onMount } from "svelte";
  import { AppearanceService } from "../services/appearanceService.js";
  import { TextService } from "../services/textService.js";
  import {
    currentFont,
    currentTextSize,
    appearancePanelOpen,
  } from "../stores/appearance.js";
  import { texts, currentIndex, previewMode } from "../stores/appStore.js";
  import XIcon from "./icons/x.svelte";
  import FontMonospaceIcon from "./icons/fontMonospace.svelte";
  import FontSerifIcon from "./icons/fontSerif.svelte";
  import FontSansIcon from "./icons/fontSans.svelte";
  import TextIncreaseIcon from "./icons/textIncrease.svelte";
  import TextDecreaseIcon from "./icons/textDecrease.svelte";

  let panelPosition = "fixed"; // "right", "bottom", or "fixed"
  let panelElement;
  let resizeObserver;

  const PANEL_WIDTH = 220;
  const PANEL_GAP = 32; // 2em gap
  const CONTENT_MAX_WIDTH = 750;
  const CONTENT_HORIZONTAL_PADDING = 64; // 4em total (2em * 2)
  const MIN_CONTENT_MARGIN = 32; // 2em margin on each side

  function saveAppearance() {
    // Only save if we're editing a text (not in preview mode)
    if ($currentIndex !== null && !$previewMode) {
      const currentText = $texts[$currentIndex];
      if (currentText) {
        const appearance = {
          font: $currentFont,
          textSize: $currentTextSize,
        };
        texts.update((textsArray) =>
          TextService.saveText(
            textsArray,
            $currentIndex,
            currentText.title,
            currentText.content,
            appearance
          )
        );
      }
    }
  }

  function handleFontChange(newFont) {
    currentFont.set(newFont);
    saveAppearance();
  }

  function handleIncreaseSize() {
    const newSize = AppearanceService.increaseTextSize($currentTextSize);
    currentTextSize.set(newSize);
    saveAppearance();
  }

  function handleDecreaseSize() {
    const newSize = AppearanceService.decreaseTextSize($currentTextSize);
    currentTextSize.set(newSize);
    saveAppearance();
  }

  function handleDefaultSize() {
    currentTextSize.set(AppearanceService.TEXT_SIZE_DEFAULT);
    saveAppearance();
  }

  function handleClose() {
    appearancePanelOpen.set(false);
  }

  function calculatePosition() {
    if (!$appearancePanelOpen) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get the main content element
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    const mainRect = mainElement.getBoundingClientRect();
    const contentHeight = mainRect.height;

    // Calculate if there's enough horizontal space
    // Total width needed = content width + gap + panel width + margins
    const totalHorizontalNeeded =
      CONTENT_MAX_WIDTH + PANEL_GAP + PANEL_WIDTH + MIN_CONTENT_MARGIN * 2;
    const hasHorizontalSpace = viewportWidth >= totalHorizontalNeeded;

    if (hasHorizontalSpace) {
      // Position to the right
      panelPosition = "right";

      // Calculate how much to shift the content
      const totalContentWidth = CONTENT_MAX_WIDTH + CONTENT_HORIZONTAL_PADDING;
      const shift = (PANEL_WIDTH + PANEL_GAP) / 2;

      // Set CSS custom property for content shift
      document.documentElement.style.setProperty(
        "--content-shift",
        `-${shift}px`
      );
    } else {
      // Check if there's vertical space for bottom positioning
      const panelHeight = panelElement?.offsetHeight || 300;
      const contentBottom = mainRect.bottom;
      const availableVerticalSpace = viewportHeight - contentBottom;

      if (availableVerticalSpace >= panelHeight + 32) {
        // Position at the bottom
        panelPosition = "bottom";
      } else {
        // Not enough space anywhere, use fixed overlay
        panelPosition = "fixed";
      }

      // Reset content shift
      document.documentElement.style.setProperty("--content-shift", "0px");
    }
  }

  $: if ($appearancePanelOpen) {
    // Recalculate on panel open
    setTimeout(calculatePosition, 0);
  } else {
    // Reset content shift when panel closes
    document.documentElement.style.setProperty("--content-shift", "0px");
  }

  function handleClickOutside(event) {
    if ($appearancePanelOpen && panelElement && !panelElement.contains(event.target)) {
      // Check if the click was on the appearance button itself
      const appearanceButton = document.querySelector('[aria-label="Appearance settings"]');
      if (appearanceButton && !appearanceButton.contains(event.target)) {
        handleClose();
      }
    }
  }

  onMount(() => {
    // Initial calculation
    calculatePosition();

    // Listen to window resize
    const handleResize = () => {
      calculatePosition();
    };
    window.addEventListener("resize", handleResize);

    // Listen to clicks outside the panel
    document.addEventListener("click", handleClickOutside);

    // Observe content changes with ResizeObserver
    const mainElement = document.querySelector("main");
    if (mainElement) {
      resizeObserver = new ResizeObserver(() => {
        calculatePosition();
      });
      resizeObserver.observe(mainElement);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  });
</script>

{#if $appearancePanelOpen}
  <div
    class="appearance-panel position-{panelPosition}"
    bind:this={panelElement}>
    <div class="btn-group">
      <button
        class="btn-font-option"
        class:active={$currentFont === AppearanceService.FONTS.SERIF}
        on:click={() => handleFontChange(AppearanceService.FONTS.SERIF)}
        aria-label="Serif font">
        <FontSerifIcon />
      </button>
      <button
        class="btn-font-option"
        class:active={$currentFont === AppearanceService.FONTS.SANS}
        on:click={() => handleFontChange(AppearanceService.FONTS.SANS)}
        aria-label="Sans-serif font">
        <FontSansIcon />
      </button>
      <button
        class="btn-font-option"
        class:active={$currentFont === AppearanceService.FONTS.MONO}
        on:click={() => handleFontChange(AppearanceService.FONTS.MONO)}
        aria-label="Monospace font">
        <FontMonospaceIcon />
      </button>
    </div>

    <div class="btn-group">
      <button
        class="btn-size"
        on:click={handleDecreaseSize}
        disabled={$currentTextSize <= AppearanceService.TEXT_SIZE_MIN}
        aria-label="Decrease text size">
        <TextDecreaseIcon />
      </button>
      <button
        class="btn-size"
        on:click={handleDefaultSize}
        disabled={$currentTextSize == AppearanceService.TEXT_SIZE_DEFAULT}
        aria-label="Default text size">
        <FontSansIcon />
      </button>
      <button
        class="btn-size"
        on:click={handleIncreaseSize}
        disabled={$currentTextSize >= AppearanceService.TEXT_SIZE_MAX}
        aria-label="Increase text size">
        <TextIncreaseIcon />
      </button>
    </div>
  </div>
{/if}

<style>
  .appearance-panel {
    position: fixed;
    display: flex;
    gap: 1em;
    flex-direction: column;
    background: var(--bg-color);
    border-radius: 16px;
    padding: 2em 1em;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    z-index: 1500;
    width: 220px;
    transition:
      all 0.3s cubic-bezier(0.47, 1.64, 0.41, 0.8),
      background 0;
  }

  /* Position: Fixed (overlay at bottom center - default mobile) */
  .appearance-panel.position-fixed {
    bottom: 0;
    left: 50%;
    top: auto;
    right: auto;
    transform: translateX(-50%);
    border-radius: 16px 16px 0 0;
    animation: slide-up 0.3s cubic-bezier(0.47, 1.64, 0.41, 0.8);
  }

  /* Position: Right (stick to right of content) */
  .appearance-panel.position-right {
    top: 50%;
    left: 50%;
    bottom: auto;
    right: auto;
    border-radius: 16px;
    /* Position relative to content: half content width + padding + gap */
    margin-left: calc(300px / 2 + 2em + 2em);
    transform: translateY(-50%);
    animation: slide-in-right 0.3s cubic-bezier(0.47, 1.64, 0.41, 0.8);
  }

  /* Position: Bottom (below content block) */
  .appearance-panel.position-bottom {
    top: auto;
    bottom: 2em;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    border-radius: 16px;
    animation: slide-up 0.3s cubic-bezier(0.47, 1.64, 0.41, 0.8);
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateY(-50%) translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
  }

  .btn-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    background: var(--panel-bg);
    border-radius: 12px;
  }

  .btn-font-option {
    background: none;
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 1em;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-font-option:hover {
    background: var(--hover-bg);
  }

  .btn-font-option.active {
    border-color: var(--text-color);
  }
  .btn-font-option:focus:not(:disabled) {
    background: none;
  }

  .btn-size {
    background: none;
    border: 2px solid transparent;
    border-radius: 12px;
    width: 4em;
    height: 4em;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-size:hover:not(:disabled) {
    background: var(--hover-bg);
  }
  .btn-size:focus:not(:disabled) {
    background: none;
  }

  .btn-size:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background: none;
    cursor: default;
    border-color: var(--text-color);
  }
</style>
