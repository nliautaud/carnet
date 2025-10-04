<script>
  export let texts = [];
  export let selectMode = false;
  export let selected = new Set();
  export let onOpenEditor;
  export let onSelectItem;
</script>

<ul class="text-list text-serif">
  {#each texts as t, i}
    <li class="text-list-item">
      <button
        type="button"
        on:click={() => !selectMode && onOpenEditor(i)}
        class="btn-text-item {t.title ? '' : 'untitled'}"
        disabled={selectMode}
      >{t.title || 'Sans titre'}</button>
      {#if selectMode}
        <input 
          type="checkbox" 
          checked={selected.has(i)} 
          on:change={() => onSelectItem(i)} 
          class="checkbox" 
          aria-label="Select text" 
        />
      {/if}
    </li>
  {/each}
</ul>
