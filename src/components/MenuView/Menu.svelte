<script>
  import {
      SharedTextService,
      TextService,
  } from "../../services/textService.js";
  import {
      currentIndex,
      mode,
      newlySharedIndexes,
      previewMode,
      selectMode,
      selected,
      sharedTexts,
      texts,
  } from "../../stores/appStore.js";
  import ActionHeader from "../ActionHeader/ActionHeader.svelte";
  import MenuActions from "./MenuActions.svelte";
  import MenuSharedTextsList from "./MenuSharedTextsList.svelte";
  import MenuTextList from "./MenuTextList.svelte";
  import MenuOnboarding from "./MenuOnboarding.svelte";

  function openEditor(i) {
    currentIndex.set(i);
    mode.set("mode-lecture");
  }

  function openSharedPreview(i) {
    currentIndex.set(i);
    mode.set("mode-lecture");
    previewMode.set(true);
  }

  function deleteSharedText(i) {
    sharedTexts.update((shared) =>
      SharedTextService.removeSharedText(shared, i),
    );

    // Update newly shared indexes
    newlySharedIndexes.update((indexes) => {
      const newIndexes = new Set();
      indexes.forEach((index) => {
        if (index > i) {
          newIndexes.add(index - 1);
        } else if (index < i) {
          newIndexes.add(index);
        }
      });
      return newIndexes;
    });

    // Handle preview mode cleanup
    if ($previewMode && $currentIndex === i) {
      currentIndex.set(null);
      previewMode.set(false);
      mode.set("mode-lecture");
    }
  }

  function handleSelectItem(i) {
    selected.update((selectedSet) => {
      const newSet = new Set(selectedSet);
      if (newSet.has(i)) {
        newSet.delete(i);
      } else {
        newSet.add(i);
      }
      return newSet;
    });
  }

  function handleDeleteSelection() {
    if ($selected.size > 0) {
      texts.update((textsArray) =>
        TextService.deleteTexts(textsArray, $selected),
      );
      selected.set(new Set());
      selectMode.set(false);
    }
  }

  async function handleShareSelection() {
    if ($selected.size > 0) {
      const selectedTexts = Array.from($selected).map((i) => $texts[i]);
      const shareUrl = SharedTextService.createShareUrl(selectedTexts);
      const success = await SharedTextService.copyToClipboard(shareUrl);

      if (success) {
        alert(`Share link copied to clipboard! (${$selected.size} texts)`);
      }
    }
  }
</script>

<ActionHeader showBackButton={false} />

<h1>Carnet</h1>

{#if $selectMode}
  <MenuActions
    selected={$selected}
    onDeleteSelection={handleDeleteSelection}
    onShareSelection={handleShareSelection}
  />
{/if}

{#if $texts.length === 0}
  <MenuOnboarding />
{:else}
  <MenuTextList
    texts={$texts}
    selectMode={$selectMode}
    selected={$selected}
    onOpenEditor={openEditor}
    onSelectItem={handleSelectItem}
  />
{/if}

<MenuSharedTextsList
  sharedTexts={$sharedTexts}
  newlySharedIndexes={$newlySharedIndexes}
  onOpenSharedPreview={openSharedPreview}
  onDeleteSharedText={deleteSharedText}
/>

<style>
  h1 {
    font-family: var(--font-serif);
    font-size: 2em;
    font-weight: 600;
    text-align: center;
    margin: 2em 0 0 0;
  }
</style>
