<script>
  export let mode = "mode-lecture";
  export let currentIndex = null;
  export let theme = "auto";
  export let onNewText;
  export let onToggleMode;
  export let onToggleTheme;
  const themeIcons = ["🌗", "☀️", "🌙"];
  const themes = ["auto", "light", "dark"];
  $: themeIcon = themeIcons[themes.indexOf(theme)] ?? "🌗";
</script>

<div id="action-panel">
  <button id="new-text-btn" on:click={onNewText}>＋</button>
  {#if currentIndex !== null}
    <button id="toggle-mode" on:click={onToggleMode}
      >{mode === "mode-edition" ? "👁" : "✏️"}</button
    >
  {/if}
  <button id="toggle-theme" on:click={onToggleTheme}>{themeIcon}</button>
</div>

<style>
  #action-panel {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    border-radius: 50px;
    border: 1px solid var(--border-color);
    background: var(--panel-bg);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  #action-panel button {
    background: none;
    border: none;
    padding: 0.6em;
    cursor: pointer;
    font-size: 1.4em;
    color: var(--text-color);
  }
</style>
