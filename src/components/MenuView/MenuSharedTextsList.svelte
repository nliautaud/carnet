<script>
    import XIcon from "../icons/x.svelte";

  export let sharedTexts = [];
  export let newlySharedIndexes = new Set();
  export let onOpenSharedPreview;
  export let onDeleteSharedText;
</script>

{#if sharedTexts && sharedTexts.length}
  <!-- Featured shared texts (newly shared) -->
  {#if newlySharedIndexes.size > 0}
    <h2 class="section-title featured">Newly shared</h2>
    <ul class="text-list container-featured">
      {#each sharedTexts as t, i}
        {#if newlySharedIndexes.has(i)}
          <li class="text-item">
            <button type="button" class="btn-text-item muted" on:click={() => onOpenSharedPreview(i)}>{t.title || 'Sans titre'}</button>
            <button class="btn-icon" title="Dismiss" on:click={() => onDeleteSharedText(i)}>
              <XIcon />
            </button>
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
  
  <!-- Regular shared texts (previously shared) -->
  {#if sharedTexts.length > newlySharedIndexes.size}
    <h2 class="section-title">Previously shared</h2>
    <ul class="text-list">
      {#each sharedTexts as t, i}
        {#if !newlySharedIndexes.has(i)}
          <li class="text-item muted">
            <button type="button" class="btn-text-item muted" on:click={() => onOpenSharedPreview(i)}>{t.title || 'Sans titre'}</button>
            <button class="btn-icon" title="Dismiss" on:click={() => onDeleteSharedText(i)}>
              <XIcon />
            </button>
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
{/if}

