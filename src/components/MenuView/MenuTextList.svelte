<script>
  import { SquareCheckIcon, SquareIcon } from "@lucide/svelte";
  import { AppearanceService } from "../../services/appearanceService.js";

  export let texts = [];
  export let selectMode = false;
  export let selected = new Set();
  export let onOpenEditor;
  export let onSelectItem;

  function getFontFamily(text) {
    return AppearanceService.getFontFamily(
      text.font || AppearanceService.FONTS.SERIF
    );
  }
</script>

<ul class="text-list">
  {#each texts as t, i}
    <li class="text-item">
      <button
        type="button"
        on:click={() => !selectMode ? onOpenEditor(i): onSelectItem(i)}
        class="btn-text-item {t.title ? '' : 'untitled'} {selectMode && selected.has(i) ? 'selected' : ''}"
        style="font-family: {getFontFamily(t)}; --delay: {i * 0.2 + .5}s;">
        {#if selectMode}
          {#if selected.has(i)}
            <SquareCheckIcon />
          {:else}
            <SquareIcon />
          {/if}
        {/if}
        {t.title || "Sans titre"}
      </button>
    </li>
  {/each}
</ul>
