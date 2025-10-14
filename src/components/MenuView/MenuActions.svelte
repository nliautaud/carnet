<script>
  import { fade, slide } from "svelte/transition";
  import ShareIcon from "../icons/share.svelte";
  import TrashIcon from "../icons/trash.svelte";

  export let selected = new Set();
  export let onDeleteSelection;
  export let onShareSelection;
</script>

<div in:fade={{ delay: 100 }} out:fade={{ duration: 150 }}>
  <div class="menu-actions" style="font-size: 0.95em;" in:slide out:slide={{ delay: 50 }}>
    {#if selected.size === 0}
      <span class="info text-muted">no item selected</span>
    {:else}
      <span class="info">{selected.size} items selected</span>
      <button class="btn-icon btn-share" on:click={onShareSelection} disabled={selected.size === 0} in:fade><ShareIcon /></button>
      <button class="btn-icon btn-danger" on:click={onDeleteSelection} disabled={selected.size === 0} in:fade><TrashIcon /></button>
    {/if}
  </div>
</div>
<style>
  .menu-actions {
    background: var(--panel-bg);
    padding: .5em;
    border-radius: 555em;
    margin: 1em 0;
    height: 2em;
    font-size: .75em;
    display: flex;
    align-items: center;
    gap: .5em;
  }
  .info {
    flex: 1;
    font-size: .85em;
    margin: 0 1em;
  }
  .btn-icon {
    height: auto;
    padding: .8em;
    border-radius: 999em;
  }
</style>
