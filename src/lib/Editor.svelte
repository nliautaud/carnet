<script>
  export let texts = [];
  export let currentIndex = undefined;
  export let mode = "mode-lecture";
  import { onMount } from "svelte";
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

<button class="close" type="button" on:click={onClose} aria-label="Fermer"
  >✖</button
>
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

<style>
  input.title {
    width: 100%;
    margin: 1em 0;
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
    background: none;
    border: none;
    font-size: 1.4em;
    color: var(--text-color);
  }

#title,
#content {
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
