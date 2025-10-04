<script>
  export let sharedTexts = [];
  export let newlySharedIndexes = new Set();
  export let onOpenSharedPreview;
  export let onDeleteSharedText;
</script>

{#if sharedTexts && sharedTexts.length}
  <!-- Featured shared texts (newly shared) -->
  {#if newlySharedIndexes.size > 0}
    <h2 class="section-title featured">Newly shared</h2>
    <ul class="shared-text-list container-featured text-serif">
      {#each sharedTexts as t, i}
        {#if newlySharedIndexes.has(i)}
          <li class="shared-text-item featured">
            <button type="button" class="btn-shared-text" on:click={() => onOpenSharedPreview(i)}>{t.title || 'Sans titre'}</button>
            <button class="btn-icon" title="Delete shared text" on:click={() => onDeleteSharedText(i)}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
  
  <!-- Regular shared texts (previously shared) -->
  {#if sharedTexts.length > newlySharedIndexes.size}
    <h2 class="section-title">Previously shared</h2>
    <ul class="shared-text-list text-serif">
      {#each sharedTexts as t, i}
        {#if !newlySharedIndexes.has(i)}
          <li class="shared-text-item">
            <button type="button" class="btn-shared-text" on:click={() => onOpenSharedPreview(i)}>{t.title || 'Sans titre'}</button>
            <button class="btn-icon" title="Delete shared text" on:click={() => onDeleteSharedText(i)}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
{/if}

