<script>
  export let texts = [];
  export let currentIndex = undefined;
  export let mode = "mode-lecture";
  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();
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
    dispatch("save");
  }
  function handleContentInput(e) {
    content = e.target.innerHTML;
    dispatch("save");
  }
  function close() {
    dispatch("showMenu");
  }
  onMount(() => {
    if (mode === "mode-edition" && titleInput) titleInput.focus();
  });
</script>

<button class="close" type="button" on:click={close} aria-label="Fermer"
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
    padding: 0.4em;
    font-size: 1.4em;
    font-weight: bold;
    border: none;
    border-bottom: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-color);
  }
  input.title:focus {
    outline: none;
    border-bottom-color: var(--text-color);
  }
  #content {
    min-height: 70vh;
    font-size: 1.2em;
    padding: 0.5em 0;
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
</style>
