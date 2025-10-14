<script>
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
  } from "../../stores/appStore.js";
  import ListCheckIcon from "../icons/listCheck.svelte";
  import MenuIcon from "../icons/menu.svelte";
  import ModeIcon from "../icons/mode.svelte";
  import PlusIcon from "../icons/plus.svelte";
  import XIcon from "../icons/x.svelte";
  import ShareButton from "./ShareButton.svelte";
  import ThemeButton from "./ThemeButton.svelte";

  let isOpen = false;

  export let classes = "";

  $: currentTexts = $previewMode && $sharedTexts.length ? $sharedTexts : $texts;

  function togglePanel() {
    isOpen = !isOpen;
    if (!isOpen) {
      selectMode.set(false);
      mode.set("mode-lecture");
    }
  }

  function newText() {
    const newText = TextService.createNewText();
    texts.update((textsArray) => TextService.addText(textsArray, newText));
    openEditor($texts.length - 1);
    setMode("mode-edition");
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
    setMode($mode === "mode-edition" ? "mode-lecture" : "mode-edition");
  }

  function handleToggleSelectMode() {
    selectMode.update((mode) => !mode);
    if ($selectMode) {
      selected.set(new Set());
    }
  }
</script>

<div class="action-panel {classes}">
  <div class="panel" class:is-open={isOpen}>
    <div class="actions" class:visible={isOpen}>
      {#if $currentIndex === null}
        <button
          class="btn-icon"
          id="new-text-btn"
          on:click={newText}
          aria-label="New text"
        >
          <PlusIcon />
        </button>
        <button
          class="btn-icon"
          id="select-mode-btn"
          on:click={handleToggleSelectMode}
          aria-label="Toggle select mode"
          aria-pressed={$selectMode}
          class:active={$selectMode}
        >
          <ListCheckIcon />
        </button>
      {/if}
      {#if $currentIndex !== null && !$previewMode}
        <button
          class="btn-icon"
          id="toggle-mode"
          on:click={handleToggleMode}
          aria-label={$mode === "mode-edition"
            ? "Switch to view mode"
            : "Switch to edit mode"}
        >
          <ModeIcon />
        </button>
      {/if}
      {#if $currentIndex !== null}
        <ShareButton
          title={currentTexts[$currentIndex || 0]?.title}
          content={currentTexts[$currentIndex || 0]?.content}
        />
      {/if}
      <ThemeButton />
    </div>
    <button
      id="toggle-panel"
      class="btn-icon"
      on:click={togglePanel}
      aria-label={isOpen ? "Close action panel" : "Open action panel"}
    >
      {#if isOpen}
        <XIcon />
      {:else}
        <MenuIcon />
      {/if}
    </button>
  </div>
</div>

<style>
  .action-panel {
    display: flex;
    justify-content: center;
  }
  .panel {
    display: flex;
    align-items: center;
    gap: 0.5em;
    z-index: 1000;
    overflow: hidden;
    background: none;
  }
  .actions {
    display: flex;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    max-width: 0;
    transition:
      opacity 0.2s,
      max-width 0.2s;
    transition-timing-function: cubic-bezier(
      0.47,
      1.64,
      0.41,
      0.8
    ); /* in-spring-like */
    overflow: hidden;
  }
  .actions.visible {
    opacity: 1;
    pointer-events: auto;
    max-width: 500px;
    border-radius: 999px;
    background: var(--panel-bg);
  }
  :global(.panel button:active) {
    animation: click-bounce 0.32s cubic-bezier(0.47, 1.64, 0.41, 0.8);
  }
  :global(.panel .actions.visible button) {
    animation: bounce-in 0.35s cubic-bezier(0.47, 1.64, 0.41, 0.8) both;
    --delay: 0.08s;
  }
  :global(.panel .actions.visible button:nth-child(1)) {
    animation-delay: 0;
  }
  :global(.panel .actions.visible button:nth-child(2)) {
    animation-delay: calc(var(--delay) * 1);
  }
  :global(.panel .actions.visible button:nth-child(3)) {
    animation-delay: calc(var(--delay) * 2);
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
