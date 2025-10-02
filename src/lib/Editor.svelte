<script>
  export let texts = [];
  export let currentIndex = undefined;
  export let mode = "mode-lecture";
  export let previewMode = false;
  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();
  export let onSave;
  export let onClose;
  let title = "";
  let content = "";
  let titleInput;
  let contentDiv;

  $: if (texts && typeof currentIndex === "number") {
    title = texts[currentIndex]?.title || "";
    content = texts[currentIndex]?.content || "";
  }

  function handleTitleInput(e) {
    title = e.target.value;
    onSave?.();
  }
  function handleContentInput(e) {
    content = e.target.innerHTML;
    onSave?.();
  }
  onMount(() => {
    if (mode === "mode-edition" && titleInput) titleInput.focus();
  });
</script>

<button class="close" type="button" on:click={onClose} aria-label="Fermer">
  <svg width="24px" height="24px" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
</button>

{#if previewMode}
  <div class="preview-pill-container">
    <span class="preview-pill">Shared content</span>
  </div>
{/if}
<input
  id="title"
  class="title"
  placeholder="Sans titre"
  bind:this={titleInput}
  bind:value={title}
  readonly={mode !== "mode-edition"}
  on:input={handleTitleInput}
/>
{#if mode === "mode-edition"}
  <div
    id="content"
    bind:this={contentDiv}
    contenteditable="true"
    bind:innerHTML={content}
    on:input={handleContentInput}
  ></div>
{:else}
  <div
    id="content"
    bind:this={contentDiv}
    contenteditable="false"
    bind:innerHTML={content}
  ></div>
{/if}
{#if previewMode}
  <button
    class="save-preview-float"
    on:click={() => dispatch("savePreviewText")}>Save to my texts</button
  >
{/if}

<style>
  input.title {
    width: 100%;
    margin: 0;
    padding: 0.5rem;
    font-size: 1.4em;
    font-weight: bold;
    border: none;
    background: transparent;
    color: var(--text-color);
  }
  input.title:focus {
    outline: none;
  }
  #content {
    min-height: 3em;
    font-size: 1.2em;
    padding: 0.5rem;
    margin-bottom: 20vh;
    color: var(--text-color);
  }
  #content:focus {
    outline: none;
  }

  .close {
    position: fixed;
    right: 36px;
    background: none;
    border: none;
    color: var(--text-color);
  }

  .preview-pill-container {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.5em;
  }
  .preview-pill {
    display: inline-block;
    background: var(--bg-color);
    color: var(--text-muted-color);
    border: 1.5px solid var(--border-color);
    border-radius: 50px;
    padding: 0.1em 1em;
    font-size: 0.8em;
    font-weight: 500;
    letter-spacing: 0.03em;
    margin-left: 0.1em;
    margin-top: 0.2em;
    margin-bottom: 0.2em;
    user-select: none;
  }
  .save-preview-float {
    position: fixed;
    left: 50%;
    bottom: 32px;
    transform: translateX(-50%);
    z-index: 2000;
    border-radius: 50px;
    background: var(--text-color);
    color: var(--bg-color);
    border: none;
    font-size: .9em;
    font-weight: 600;
    padding: 0.72em 2em;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s,
      box-shadow 0.2s;
  }
  .save-preview-float:active {
    background: var(--border-color);
    color: var(--text-color);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  }

  #title,
  #content {
    font-family: "Newsreader", Georgia, "Times New Roman", serif;
    border-left: 3px solid transparent;
    transition: border-color 0.2s;
  }
  :global(body.mode-lecture #title),
  :global(body.mode-lecture #content) {
    pointer-events: none;
    user-select: text;
  }
  :global(body.mode-edition #title),
  :global(body.mode-edition #content) {
    border-left: 3px solid var(--border-color);
  }
</style>
