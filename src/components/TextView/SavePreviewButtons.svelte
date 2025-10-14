<script>
  export let existingIdx;
  export let onSavePreviewText;
</script>

<div class="save-preview-btns-container">
  {#if existingIdx !== -1}
    <button
      class="save-preview-float"
      on:click={() => onSavePreviewText?.('new')}
      >Save as new text</button
    >
    <button
      class="save-preview-float override"
      on:click={() => onSavePreviewText?.('override')}
      >Override existing text</button
    >
  {:else}
    <button
      class="save-preview-float"
      on:click={() => onSavePreviewText?.()}>Save to my texts</button
    >
  {/if}
</div>

<style>
  .save-preview-btns-container {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 7vh;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
    pointer-events: none;
  }
  .save-preview-float {
    pointer-events: auto;
    border-radius: 50px;
    background: var(--text-color);
    color: var(--bg-color);
    border: none;
    font-size: 0.9em;
    font-weight: 600;
    padding: 0.72em 2em;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s,
      box-shadow 0.2s;
    margin: 0;
    width: max-content;
    min-width: 220px;
  }
  .save-preview-float.override {
    background: var(--bg-color);
    color: var(--text-color);
  }
</style>
