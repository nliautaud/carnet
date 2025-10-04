<script>
  export let texts = [];
  export let sharedTexts = [];
  export let newlySharedIndexes = new Set();
  export let onOpenEditor;
  export let onOpenSharedPreview;
  export let onDeleteSharedText;
  export let selectMode = false;
  export let selected = new Set();
  export let onSelectItem;
  export let onDeleteSelection;
  export let onShareSelection;
</script>

<h1>Carnet</h1>
{#if selectMode}
  <div class="selection-section">
    {#if selected.size === 0}
      <span class="items-selected">no item selected</span>
    {:else}
      <span class="items-selected">{selected.size} items selected</span>
      <button class="share-selection" on:click={onShareSelection} disabled={selected.size === 0}>share selected</button>
      <button class="delete-selection" on:click={onDeleteSelection} disabled={selected.size === 0}>delete selection</button>
    {/if}
  </div>
{/if}
<ul class="text-list">
  {#each texts as t, i}
    <li>
      <button
        type="button"
        on:click={() => !selectMode && onOpenEditor(i)}
        class={t.title ? "" : "untitled"}
        disabled={selectMode}
      >{t.title || "Sans titre"}</button>
      {#if selectMode}
        <input type="checkbox" checked={selected.has(i)} on:change={() => onSelectItem(i)} class="entry-checkbox" aria-label="Select text" />
      {/if}
    </li>
  {/each}
</ul>
{#if sharedTexts && sharedTexts.length}
  <!-- Featured shared texts (newly shared) -->
  {#if newlySharedIndexes.size > 0}
    <h2 class="shared-section-title featured">Newly shared</h2>
    <ul class="shared-list featured">
      {#each sharedTexts as t, i}
        {#if newlySharedIndexes.has(i)}
          <li class="shared-item featured">
            <button type="button" class="shared-btn" on:click={() => onOpenSharedPreview(i)}>{t.title || "Sans titre"}</button>
            <button class="delete-shared" title="Delete shared text" on:click={() => onDeleteSharedText(i)}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
  
  <!-- Regular shared texts (previously shared) -->
  {#if sharedTexts.length > newlySharedIndexes.size}
    <h2 class="shared-section-title">Previously shared</h2>
    <ul class="shared-list">
      {#each sharedTexts as t, i}
        {#if !newlySharedIndexes.has(i)}
          <li class="shared-item">
            <button type="button" class="shared-btn" on:click={() => onOpenSharedPreview(i)}>{t.title || "Sans titre"}</button>
            <button class="delete-shared" title="Delete shared text" on:click={() => onDeleteSharedText(i)}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
{/if}

<style>
  h1,
  ul {
    font-family: var(--font-serif);
    font-weight: 500;
  }

  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 0.8em 0;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
  ul button {
    flex: 1;
    text-align: left;
    display: block;
    padding: 0.6em 1em;
    border-radius: 6px;
    text-decoration: none;
    color: var(--text-color);
    border: 1px solid var(--border-color);
    transition: background 0.2s;
    background: var(--bg-color);
    font-size: 1em;
  }
  button.untitled {
    font-style: italic;
    color: var(--text-muted-color);
  }
  button:hover {
    background: var(--hover-bg);
  }
  .shared-section-title {
    font-size: .9em;
    color: var(--text-muted-color);
    margin-top: 2em;
    margin-bottom: 0.5em;
    font-weight: 400;
  }
  .shared-section-title.featured {
    color: var(--text-color);
    font-weight: 500;
  }
  .shared-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .shared-list.featured {
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 1em;
    margin-bottom: 1em;
    background: var(--bg-color);
  }
  .shared-item {
    display: flex;
    align-items: center;
    margin: 0.5em 0;
    opacity: 0.7;
  }
  .shared-item.featured {
    opacity: 1;
    margin: 0.3em 0;
  }
  .shared-btn {
    flex: 1;
    text-align: left;
    background: none;
    border: 1px solid var(--border-color);
    color: var(--text-muted-color);
    border-radius: 6px;
    padding: 0.6em 1em;
    font-size: 1em;
    font-style: italic;
    transition: background 0.2s;
    cursor: pointer;
  }
  .shared-btn:hover {
    background: var(--hover-bg);
  }
  .delete-shared {
    flex: none;
    background: none;
    border: none;
    color: var(--text-muted-color);
    margin-left: 0.5em;
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .delete-shared:hover {
    background: var(--hover-bg);
    color: var(--text-color);
  }
  .selection-section {
    display: flex;
    align-items: center;
    gap: 1em;
    margin-bottom: 0.5em;
    font-size: 0.95em;
    color: var(--text-muted-color);
  }
  .items-selected {
    flex: 1;
  }
  .share-selection {
    background: #3498db;
    color: #fff;
    border: none;
    border-radius: 1em;
    padding: 0.3em 0.8em;
    cursor: pointer;
    font-size: 0.95em;
    margin-left: 0.5em;
  }
  .share-selection:hover:not(:disabled) {
    background: #2980b9;
  }
  .share-selection:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
  .delete-selection {
    background: #e74c3c;
    color: #fff;
    border: none;
    border-radius: 1em;
    padding: 0.3em 0.8em;
    cursor: pointer;
    font-size: 0.95em;
    margin-left: 0.5em;
  }
  .delete-selection:hover:not(:disabled) {
    background: #c0392b;
  }
  .delete-selection:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
  .entry-checkbox {
    margin-right: 0.7em;
    accent-color: var(--text-color);
    width: 1.1em;
    height: 1.1em;
    vertical-align: middle;
  }
</style>
