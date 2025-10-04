<script>
  import { onMount } from 'svelte';
  import { updateMeta } from '../../lib/meta.js';
  import { TextService } from '../../services/textService.js';
  import { currentIndex, mode, previewMode, sharedTexts, texts } from '../../stores/appStore.js';
  import CloseButton from '../CloseButton.svelte';
  import PreviewPill from './PreviewPill.svelte';
  import SavePreviewButtons from './SavePreviewButtons.svelte';

  let title = '';
  let content = '';
  let titleInput;
  let contentDiv;

  // Reactive values from stores
  $: currentTexts = $previewMode && $sharedTexts.length ? $sharedTexts : $texts;
  $: if (currentTexts && typeof $currentIndex === 'number') {
    title = currentTexts[$currentIndex]?.title || '';
    content = currentTexts[$currentIndex]?.content || '';
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

  function save() {
    if ($currentIndex !== null) {
      const titleEl = document.getElementById('title');
      const contentEl = document.getElementById('content');
      const title = titleEl && 'value' in titleEl ? titleEl.value : '';
      const content = contentEl && 'innerHTML' in contentEl ? contentEl.innerHTML : '';
      
      texts.update(textsArray => 
        TextService.saveText(textsArray, $currentIndex, title, content)
      );
    }
  }

  function onClose() {
    currentIndex.set(null);
    mode.set('mode-lecture');
    previewMode.set(false);
    // Clean URL
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    window.history.replaceState({}, document.title, url.pathname + url.search);
    updateMeta();
  }

  function onSavePreviewText(detail) {
    if ($previewMode && $sharedTexts.length && typeof $currentIndex === 'number') {
      const toSave = $sharedTexts[$currentIndex];
      const existingIdx = TextService.findTextIndexByTitle(toSave.title, $texts);
      let newCurrentIndex;
      
      if (detail === 'override' && existingIdx !== -1) {
        texts.update(textsArray => {
          textsArray[existingIdx] = toSave;
          return textsArray;
        });
        newCurrentIndex = existingIdx;
      } else if (detail === 'new' && existingIdx !== -1) {
        const newTitle = TextService.generateUniqueTitle(toSave.title || 'Sans titre', $texts);
        texts.update(textsArray => {
          const newTexts = [...textsArray, { ...toSave, title: newTitle }];
          return newTexts;
        });
        newCurrentIndex = $texts.length;
      } else {
        texts.update(textsArray => TextService.addText(textsArray, toSave));
        newCurrentIndex = $texts.length;
      }
      
      // Remove shared text and clean up
      sharedTexts.update(shared => 
        TextService.deleteText(shared, $currentIndex)
      );
      currentIndex.set(newCurrentIndex);
      previewMode.set(false);
      onClose();
    }
  }

  // Reactive statement to handle mode changes
  $: if ($mode === 'mode-edition' && titleInput) {
    titleInput.focus();
  }

  // Ensure body class is in sync with mode
  $: {
    if (typeof document !== 'undefined') {
      document.body.className = $mode;
    }
  }

  onMount(() => {
    if (currentTexts && typeof $currentIndex === 'number') {
      updateMeta(currentTexts[$currentIndex]);
    }
  });
</script>

<CloseButton onClose={onClose} />

{#if $previewMode}
  <PreviewPill />
{/if}

<input
  id="title"
  class="title"
  placeholder="Sans titre"
  bind:this={titleInput}
  bind:value={title}
  readonly={$mode !== 'mode-edition'}
  on:input={handleTitleInput}
/>

{#if $mode === 'mode-edition'}
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

{#if $previewMode}
  {#if currentTexts && typeof $currentIndex === 'number'}
    {@const previewTitle = currentTexts[$currentIndex]?.title || ''}
    {@const existingIdx = $texts.findIndex(
      (t) =>
        t.title?.trim().toLowerCase() === previewTitle.trim().toLowerCase()
    )}
    <SavePreviewButtons
      {existingIdx}
      onSavePreviewText={onSavePreviewText}
    />
  {/if}
{/if}

<style>
  input.title {
    width: 100%;
    margin: 2em 0 1em 0;
    padding: 0.5rem;
    font-size: 1.75em;
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
    font-size: 1.2em;
    padding: 0.5rem;
    margin-bottom: 20vh;
    color: var(--text-color);
  }
  #content:focus {
    outline: none;
  }

  #title,
  #content {
    font-family: 'Newsreader', Georgia, 'Times New Roman', serif;
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
