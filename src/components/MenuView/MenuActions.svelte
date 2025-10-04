<script>
  export let selected = new Set();
  export let onDeleteSelection;
  export let onShareSelection;
</script>

<div class="flex items-center gap-sm margin-sm text-muted" style="font-size: 0.95em;">
  {#if selected.size === 0}
    <span class="flex-1">no item selected</span>
  {:else}
    <span class="flex-1">{selected.size} items selected</span>
    <button class="btn-action btn-share" on:click={onShareSelection} disabled={selected.size === 0}>share selected</button>
    <button class="btn-action btn-danger" on:click={onDeleteSelection} disabled={selected.size === 0}>delete selection</button>
  {/if}
</div>
