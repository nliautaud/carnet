<script>
  import { fade, slide } from "svelte/transition";
  import { selectMode } from "../../stores/appStore";
  import { ShareIcon, TrashIcon, XIcon } from "@lucide/svelte";

  export let selected = new Set();
  export let onDeleteSelection;
  export let onShareSelection;
</script>

<div in:fade={{ delay: 100 }} out:fade={{ duration: 150 }}>
  <div
    class="menu-actions"
    style="font-size: 0.95em;"
    in:slide
    out:slide={{ delay: 50 }}>
    <button
      class="btn-icon btn-close"
      aria-label="Close menu actions"
      on:click={() => selectMode.update((mode) => !mode)}>
      <XIcon />
    </button>
    {#if selected.size === 0}
      <span class="info text-muted">no item selected</span>
    {:else}
      <span class="info">{selected.size} items selected</span>
      <button
        class="btn-icon btn-share"
        on:click={onShareSelection}
        disabled={selected.size === 0}
        in:fade><ShareIcon /></button>
      <button
        class="btn-icon btn-danger"
        on:click={onDeleteSelection}
        disabled={selected.size === 0}
        in:fade><TrashIcon /></button>
    {/if}
  </div>
</div>

<style>
  .menu-actions {
    background: var(--panel-bg);
    padding: 0.5em;
    border-radius: 555em;
    margin: 1em 0;
    height: 2em;
    font-size: 0.75em;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
  .info {
    flex: 1;
    font-size: 0.85em;
    margin: 0 1em 0 0;
  }
  .btn-icon {
    height: auto;
    padding: 0.8em;
    border-radius: 999em;
  }
</style>
