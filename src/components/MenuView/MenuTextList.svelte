<script>
  import SquareIcon from "../icons/square.svelte";
  import SquareCheckFilledIcon from "../icons/squareCheckFilled.svelte";

  export let texts = [];
  export let selectMode = false;
  export let selected = new Set();
  export let onOpenEditor;
  export let onSelectItem;
</script>

<ul class="text-list">
  {#each texts as t, i}
    <li class="text-item">
      {#if selectMode}
        <button
          type="button"
          class="checkbox-btn"
          aria-label="Select text"
          on:click={() => onSelectItem(i)}
        >
          {#if selected.has(i)}
            <SquareCheckFilledIcon />
          {:else}
            <SquareIcon />
          {/if}
        </button>
      {/if}
      <button
        type="button"
        on:click={() => !selectMode && onOpenEditor(i)}
        class="btn-text-item {t.title ? '' : 'untitled'}"
        disabled={selectMode}
      >
        {t.title || "Sans titre"}
      </button>
    </li>
  {/each}
</ul>

<style>
  .checkbox-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25em;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
  }
</style>
