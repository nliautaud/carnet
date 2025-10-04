<script>
  export let texts = [];
  export let mode = "mode-lecture";
  export let currentIndex = null;
  export let theme = "auto";
  export let onNewText;
  export let onToggleMode;
  export let onToggleTheme;
  export let onClosePanel;
  export let showModeToggle = true;
  export let selectMode = false;
  export let onToggleSelectMode;
  const themeIcons = ["🌗", "☀️", "🌙"];
  const themes = ["auto", "light", "dark"];
  $: themeIcon = themeIcons[themes.indexOf(theme)] ?? "🌗";
  let isOpen = false;

  function togglePanel() {
    isOpen = !isOpen;
    if (!isOpen) {
      onClosePanel?.();
    }
  }

  import ShareButton from "./ShareButton.svelte";
</script>

<div id="action-panel" class:is-open={isOpen}>
  <div class="actions" class:visible={isOpen}>
    {#if currentIndex === null}
      <button id="new-text-btn" on:click={onNewText} aria-label="New text">＋</button>
      <button id="select-mode-btn" on:click={onToggleSelectMode} aria-label="Toggle select mode" aria-pressed={selectMode} class:active={selectMode}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style="vertical-align:middle;">
          <rect x="3" y="3" width="16" height="16" rx="4" stroke="currentColor" stroke-width="2" fill={selectMode ? 'currentColor' : 'none'} />
          <polyline points="7,12 10,15 15,8" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity:{selectMode ? 1 : 0};transition:opacity 0.15s;" />
        </svg>
      </button>
    {/if}
    {#if currentIndex !== null && showModeToggle}
      <button
        id="toggle-mode"
        on:click={onToggleMode}
        aria-label={mode === "mode-edition"
          ? "Switch to view mode"
          : "Switch to edit mode"}
      >
        {mode === "mode-edition" ? "👁" : "✏️"}
      </button>
    {/if}
    {#if currentIndex !== null}
      <ShareButton
        title={texts[currentIndex || 0]?.title}
        content={texts[currentIndex || 0]?.content}
      />
    {/if}
    <button id="toggle-theme" on:click={onToggleTheme} aria-label="Toggle theme"
      >{themeIcon}</button
    >
  </div>
  <button
    id="toggle-panel"
    on:click={togglePanel}
    aria-label={isOpen ? "Close action panel" : "Open action panel"}
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style="vertical-align:middle"
    >
      <rect x="4" y="7" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="4" y="15" width="16" height="2" rx="1" fill="currentColor" />
    </svg>
  </button>
</div>

<style>
  #action-panel {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 50px;
    z-index: 1000;
    transition:
      background 0.2s,
      border 0.2s,
      box-shadow 0.2s;
    overflow: hidden;
  }
  #action-panel:not(.is-open) {
    background: none;
    box-shadow: none;
  }
  #action-panel.is-open {
    background: var(--panel-bg);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    max-height: 0;
    transition:
      opacity 0.2s,
      max-height 0.2s;
    overflow: hidden;
  }
  .actions.visible {
    opacity: 1;
    pointer-events: auto;
    max-height: none;
  }
  :global(#action-panel button) {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.4em;
    color: var(--text-color);
    transition:
      background 0.2s,
      border 0.2s;
  }
  :global(#action-panel.is-open button) {
    background: none;
    border: none;
  }
  :global(#action-panel:not(.is-open) button) {
    background: none;
    border: none;
    box-shadow: none;
  }
  :global(#action-panel button:last-child) {
    border-radius: 0 0 50px 50px;
  }
  :global(#action-panel button:first-child) {
    border-radius: 50px 50px 0 0;
  }
  :global(#action-panel button:active) {
    animation: click-bounce 0.32s cubic-bezier(0.47, 1.64, 0.41, 0.8);
  }
  :global(#action-panel .actions.visible button) {
    animation: bounce-in 0.35s cubic-bezier(0.47, 1.64, 0.41, 0.8) both;
    --delay: 0.08s;
  }
  :global(#action-panel .actions.visible button:nth-child(3)) {
    animation-delay: 0;
  }
  :global(#action-panel .actions.visible button:nth-child(2)) {
    animation-delay: calc(var(--delay) * 1);
  }
  :global(#action-panel .actions.visible button:nth-child(1)) {
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
