<script>
  import { EyeIcon, ListCheckIcon, PaletteIcon, PencilIcon, PlusIcon } from "@lucide/svelte";
  import { TextService } from "../../services/textService.js";
  import { ThemeService } from "../../services/themeService.js";
  import {
    currentIndex,
    mode,
    previewMode,
    selectMode,
    selected,
    sharedTexts,
    texts,
    actionBarOpen,
  } from "../../stores/appStore.js";
  import { appearancePanelOpen } from "../../stores/appearance.js";
  import ShareButton from "./ShareButton.svelte";
  import ThemeButton from "./ThemeButton.svelte";

  export let classes = "";

  $: currentTexts = $previewMode && $sharedTexts.length ? $sharedTexts : $texts;
  $: isEditMode = $mode === "mode-edition";

  function closeActionBar() {
    actionBarOpen.set(false);
  }

  function newText() {
    const newText = TextService.createNewText();
    texts.update((textsArray) => TextService.addText(textsArray, newText));
    openEditor($texts.length - 1);
    setMode("mode-edition");
    // Don't close action bar - let user continue interacting
  }

  function openEditor(i) {
    currentIndex.set(i);
    setMode("mode-lecture");
  }

  function setMode(m) {
    mode.set(m);
    ThemeService.applyMode(m);
  }

  function handleToggleMode() {
    if ($mode === "mode-edition") {
      // Switching to view mode - close action bar
      setMode("mode-lecture");
      closeActionBar();
    } else {
      // Switching to edit mode - don't close action bar
      setMode("mode-edition");
    }
  }

  function handleToggleSelectMode() {
    selectMode.update((mode) => !mode);
    if ($selectMode) {
      selected.set(new Set());
    }
    closeActionBar();
  }

  function handleToggleAppearance() {
    appearancePanelOpen.update((open) => !open);
    closeActionBar();
  }

  function handleShare() {
    // Share button will handle its own logic
    // We just need to close the action bar after
    closeActionBar();
  }

  function handleThemeToggle() {
    // Theme toggle should NOT close the action bar
    // The ThemeButton component handles the theme change
  }
</script>

<div class="action-bar {classes}" class:visible={$actionBarOpen}>
  {#if $currentIndex === null}
    <button
      class="btn-icon"
      id="new-text-btn"
      on:click={newText}
      aria-label="New text">
      <PlusIcon />
    </button>
    {#if $texts.length > 0}
      <button
        class="btn-icon"
        id="select-mode-btn"
        on:click={handleToggleSelectMode}
        aria-label="Toggle select mode"
        aria-pressed={$selectMode}
        class:active={$selectMode}>
        <ListCheckIcon />
      </button>
    {/if}
    <ThemeButton />
  {/if}
  {#if $currentIndex !== null && !$previewMode}
    {#if isEditMode}
      <!-- In edit mode, only show view mode button -->
      <button
        class="btn-icon"
        id="toggle-mode"
        on:click={handleToggleMode}
        aria-label="Switch to view mode">
        <EyeIcon />
      </button>
    {:else}
      <!-- In view mode, show all buttons -->
      <button
        class="btn-icon"
        id="toggle-mode"
        on:click={handleToggleMode}
        aria-label="Switch to edit mode">
        {#if $mode === "mode-lecture"}
          <PencilIcon />
        {:else if $mode === "mode-edition"}
          <EyeIcon />
        {/if}
      </button>
      <ShareButton
        title={currentTexts[$currentIndex || 0]?.title}
        content={currentTexts[$currentIndex || 0]?.content}
        on:shared={handleShare} />
      <button
        class="btn-icon"
        on:click={handleToggleAppearance}
        aria-label="Appearance settings"
        aria-pressed={$appearancePanelOpen}
        class:active={$appearancePanelOpen}>
        <PaletteIcon />
      </button>
      <ThemeButton />
    {/if}
  {/if}
</div>

<style>
  .action-bar {
    display: flex;
    align-items: center;
    gap: 0;
    border-radius: 999px;
    background: var(--panel-bg);
    padding: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s cubic-bezier(0.47, 1.64, 0.41, 0.8);
  }

  .action-bar.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .action-bar :global(button:active) {
    animation: click-bounce 0.32s cubic-bezier(0.47, 1.64, 0.41, 0.8);
  }

  .action-bar.visible :global(button),
  .action-bar.visible :global(> *) {
    animation: bounce-in 0.35s cubic-bezier(0.47, 1.64, 0.41, 0.8) both;
    --delay: 0.08s;
  }

  .action-bar.visible :global(> *:nth-child(1)) {
    animation-delay: 0;
  }

  .action-bar.visible :global(> *:nth-child(2)) {
    animation-delay: calc(var(--delay) * 1);
  }

  .action-bar.visible :global(> *:nth-child(3)) {
    animation-delay: calc(var(--delay) * 2);
  }

  .action-bar.visible :global(> *:nth-child(4)) {
    animation-delay: calc(var(--delay) * 3);
  }

  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: translateY(10px) scaleY(1.5);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scaleY(1);
    }
  }

  @keyframes click-bounce {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(1.2, 0.92);
    }
    40% {
      transform: scale(0.96, 1.08);
    }
    60% {
      transform: scale(1.04, 0.98);
    }
    80% {
      transform: scale(0.98, 1.02);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
