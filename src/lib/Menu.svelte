<script>
  export let texts = [];
  export let sharedTexts = [];
  export let onOpenEditor;
  export let onOpenSharedPreview;
  export let onDeleteSharedText;
</script>

<h1>Mes Textes</h1>
<ul>
  {#each texts as t, i}
    <li>
      <button
        type="button"
        on:click={() => onOpenEditor(i)}
        class={t.title ? "" : "untitled"}>{t.title || "Sans titre"}</button>
    </li>
  {/each}
</ul>
{#if sharedTexts && sharedTexts.length}
  <h2 class="shared-section-title">Shared with me</h2>
  <ul class="shared-list">
    {#each sharedTexts as t, i}
      <li class="shared-item">
        <button type="button" class="shared-btn" on:click={() => onOpenSharedPreview(i)}>{t.title || "Sans titre"}</button>
        <button class="delete-shared" title="Delete shared text" on:click={() => onDeleteSharedText(i)}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </li>
    {/each}
  </ul>
{/if}

<style>
  h1,
  ul {
    font-family: "Newsreader", Georgia, "Times New Roman", serif;
  }

  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 0.8em 0;
    width: 100%;
    display: flex;
  }
  button {
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
  .shared-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .shared-item {
    display: flex;
    align-items: center;
    margin: 0.5em 0;
    opacity: 0.7;
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
</style>
