<script>
  import { onMount } from "svelte";
  import { updateMeta } from "../../lib/meta.js";
  import { TextService } from "../../services/textService.js";
  import { AppearanceService } from "../../services/appearanceService.js";
  import {
  actionBarOpen,
    currentIndex,
    mode,
    previewMode,
    sharedTexts,
    texts,
  } from "../../stores/appStore.js";
  import {
    currentFont,
    currentTextSize,
    appearancePanelOpen,
  } from "../../stores/appearance.js";
  import ActionHeader from "../ActionHeader/ActionHeader.svelte";
  import PreviewPill from "./PreviewPill.svelte";
  import SavePreviewButtons from "./SavePreviewButtons.svelte";

  let title = "";
  let content = "";
  let titleInput;
  let contentDiv;

  // Reactive values from stores
  $: currentTexts = $previewMode && $sharedTexts.length ? $sharedTexts : $texts;
  $: if (currentTexts && typeof $currentIndex === "number") {
    const currentText = currentTexts[$currentIndex];
    title = currentText?.title || "";
    content = currentText?.content || "";

    // Load appearance settings from current text
    currentFont.set(currentText?.font || AppearanceService.FONTS.SERIF);
    currentTextSize.set(
      currentText?.textSize || AppearanceService.TEXT_SIZE_DEFAULT
    );
  }

  // Apply appearance settings when they change
  $: {
    AppearanceService.applyFont($currentFont);
    AppearanceService.applyTextSize($currentTextSize);
  }

  function handleTitleInput(e) {
    title = e.target.value;
    updateMeta(currentTexts[$currentIndex]);
    save();
  }

  function handleContentInput(e) {
    updateMeta(currentTexts[$currentIndex]);
    content = e.target.innerHTML;
    save();
  }

  function handleDoubleClick() {
    if ($mode !== "mode-edition") {
      mode.set("mode-edition");
      actionBarOpen.set(true);
    }
  }

  function save() {
    if ($currentIndex !== null) {
      const titleEl = document.getElementById("title");
      const contentEl = document.getElementById("content");
      const title = titleEl && "value" in titleEl ? titleEl.value : "";
      const content =
        contentEl && "innerHTML" in contentEl ? contentEl.innerHTML : "";

      const appearance = {
        font: $currentFont,
        textSize: $currentTextSize,
      };

      texts.update((textsArray) =>
        TextService.saveText(
          textsArray,
          $currentIndex,
          title,
          content,
          appearance
        )
      );
    }
  }

  function onClose() {
    currentIndex.set(null);
    mode.set("mode-lecture");
    previewMode.set(false);
    appearancePanelOpen.set(false);
    // Clean URL
    const url = new URL(window.location.href);
    url.searchParams.delete("share");
    window.history.replaceState({}, document.title, url.pathname + url.search);
    updateMeta();
  }

  function onSavePreviewText(detail) {
    if (
      $previewMode &&
      $sharedTexts.length &&
      typeof $currentIndex === "number"
    ) {
      const toSave = $sharedTexts[$currentIndex];
      const existingIdx = TextService.findTextIndexByTitle(
        toSave.title,
        $texts
      );
      let newCurrentIndex;

      if (detail === "override" && existingIdx !== -1) {
        texts.update((textsArray) => {
          textsArray[existingIdx] = toSave;
          return textsArray;
        });
        newCurrentIndex = existingIdx;
      } else if (detail === "new" && existingIdx !== -1) {
        const newTitle = TextService.generateUniqueTitle(
          toSave.title || "Sans titre",
          $texts
        );
        texts.update((textsArray) => {
          const newTexts = [...textsArray, { ...toSave, title: newTitle }];
          return newTexts;
        });
        newCurrentIndex = $texts.length;
      } else {
        texts.update((textsArray) => TextService.addText(textsArray, toSave));
        newCurrentIndex = $texts.length;
      }

      // Remove shared text and clean up
      sharedTexts.update((shared) =>
        TextService.deleteText(shared, $currentIndex)
      );
      currentIndex.set(newCurrentIndex);
      previewMode.set(false);
      onClose();
    }
  }

  // Reactive statement to handle mode changes
  $: if ($mode === "mode-edition" && titleInput) {
    titleInput.focus();
  }

  // Ensure body class is in sync with mode
  $: {
    if (typeof document !== "undefined") {
      document.body.className = $mode;
    }
  }

  onMount(() => {
    if (currentTexts && typeof $currentIndex === "number") {
      updateMeta(currentTexts[$currentIndex]);
    }
  });
</script>

<ActionHeader />

{#if $previewMode}
  <PreviewPill />
{/if}

<div
  class="title-wrapper"
  on:dblclick={handleDoubleClick}
  role="button"
  tabindex="0">
  <input
    id="title"
    class="title"
    placeholder="Sans titre"
    bind:this={titleInput}
    bind:value={title}
    readonly={$mode !== "mode-edition"}
    on:input={handleTitleInput} />
</div>

{#if $mode === "mode-edition"}
  <div
    id="content"
    bind:this={contentDiv}
    contenteditable="true"
    bind:innerHTML={content}
    on:input={handleContentInput}>
  </div>
{:else}
  <div
    id="content"
    bind:this={contentDiv}
    contenteditable="false"
    bind:innerHTML={content}
    on:dblclick={handleDoubleClick}
    role="button"
    tabindex="0">
  </div>
{/if}

{#if $previewMode}
  {#if currentTexts && typeof $currentIndex === "number"}
    {@const previewTitle = currentTexts[$currentIndex]?.title || ""}
    {@const existingIdx = $texts.findIndex(
      (t) => t.title?.trim().toLowerCase() === previewTitle.trim().toLowerCase()
    )}
    <SavePreviewButtons {existingIdx} {onSavePreviewText} />
  {/if}
{/if}

<style>
  .title-wrapper {
    display: flex;
  }
  input.title {
    width: 100%;
    margin: 1rem 0 1rem 0;
    padding: 0.5rem;
    font-size: calc(var(--content-font-size, 22px) * 1.45);
    font-weight: 600;
    border: none;
    background: transparent;
    color: var(--text-color);
  }
  input.title:focus {
    outline: none;
  }
  #content {
    min-height: 3em;
    font-size: var(--content-font-size, 22px);
    padding: 0.5rem;
    margin-bottom: 20vh;
    color: var(--text-color);
    line-height: 1.6;
    position: relative;
  }
  #content:focus {
    outline: none;
  }

  #title,
  #content {
    font-family: var(--content-font);
    border-left: 3px solid transparent;
    transition: border-color 0.2s;
  }
  :global(body.mode-lecture #title),
  :global(body.mode-lecture #content) {
    user-select: text;
    cursor: text;
  }
  :global(body.mode-edition #title),
  :global(body.mode-edition #content) {
    border-left: 3px solid var(--border-color);
  }
</style>
