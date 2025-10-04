<script>
  import { onMount } from "svelte";
  import "./app.css";
  import ActionPanel from "./lib/ActionPanel.svelte";
  import Editor from "./lib/Editor.svelte";
  import Menu from "./lib/Menu.svelte";
  import { compress, decompress } from "./lib/compression";
  import { updateMeta } from "./lib/meta";

  let texts = [];
  let sharedTexts = [];
  let currentIndex = null;
  let mode = "mode-lecture"; // or 'mode-edition'
  let theme = "auto";
  let previewMode = false;
  let selectMode = false;
  let selected = new Set();
  let newlySharedIndexes = new Set(); // Track indexes of newly shared texts in current session

  function addSharedText(text) {
    sharedTexts = [...sharedTexts, text];
    localStorage.setItem("sharedTexts", JSON.stringify(sharedTexts));
  }

  function removeSharedText(i) {
    sharedTexts = sharedTexts.slice(0, i).concat(sharedTexts.slice(i + 1));
    localStorage.setItem("sharedTexts", JSON.stringify(sharedTexts));
  }

  // Load from localStorage or from share param
  onMount(() => {
    updateMeta();
    const params = new URLSearchParams(window.location.search);
    const share = params.get("share");
    const stored = localStorage.getItem("texts");
    texts = stored ? JSON.parse(stored) : [];
    const storedShared = localStorage.getItem("sharedTexts");
    sharedTexts = storedShared ? JSON.parse(storedShared) : [];
    if (share) {
      try {
        const data = JSON.parse(decompress(share));
        // Handle array of texts
        const startIndex = sharedTexts.length;
        data.forEach(text => addSharedText(text));
        
        // Mark the newly added texts as featured
        for (let i = startIndex; i < sharedTexts.length; i++) {
          newlySharedIndexes.add(i);
        }
        
        // Only open preview if there's exactly one shared text
        if (data.length === 1) {
          currentIndex = sharedTexts.length - 1;
          mode = "mode-lecture";
          previewMode = true;
        } else {
          // Multiple texts - stay in menu mode to show all shared texts
          currentIndex = null;
          mode = "mode-lecture";
          previewMode = false;
        }
        
        // Remove ?share param from URL
        const url = new URL(window.location.href);
        url.searchParams.delete("share");
        window.history.replaceState(
          {},
          document.title,
          url.pathname + url.search,
        );
      } catch (e) {
        // ignore
      }
    }
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) theme = storedTheme;
    document.body.dataset.theme = theme;
    document.body.className = mode;
  });

  function save() {
    if (currentIndex !== null) {
      // Use type assertion for input element
      const titleEl = document.getElementById("title");
      const contentEl = document.getElementById("content");
      texts[currentIndex] = {
        title: titleEl && "value" in titleEl ? titleEl.value : "",
        content:
          contentEl && "innerHTML" in contentEl ? contentEl.innerHTML : "",
      };
      localStorage.setItem("texts", JSON.stringify(texts));
    }
  }

  // Utility: find index of text with same title (case-insensitive, trimmed)
  function findTextIndexByTitle(title) {
    return texts.findIndex(
      (t) => t.title?.trim().toLowerCase() === title?.trim().toLowerCase(),
    );
  }

  // Save preview: support override or save as new
  function savePreviewText(detail) {
    if (previewMode && sharedTexts.length && typeof currentIndex === "number") {
      const toSave = sharedTexts[currentIndex];
      let all = [...texts];
      const existingIdx = findTextIndexByTitle(toSave.title);
      let newCurrentIndex;
      if (detail === "override" && existingIdx !== -1) {
        all[existingIdx] = toSave;
        localStorage.setItem("texts", JSON.stringify(all));
        texts = all;
        newCurrentIndex = existingIdx;
      } else if (detail === "new" && existingIdx !== -1) {
        let base = toSave.title || "Sans titre";
        let n = 2;
        let newTitle = base + " (2)";
        while (findTextIndexByTitle(newTitle) !== -1) {
          n++;
          newTitle = `${base} (${n})`;
        }
        all.push({ ...toSave, title: newTitle });
        localStorage.setItem("texts", JSON.stringify(all));
        texts = all;
        newCurrentIndex = all.length - 1;
      } else {
        all.push(toSave);
        localStorage.setItem("texts", JSON.stringify(all));
        texts = all;
        newCurrentIndex = all.length - 1;
      }
      // Remove the shared text after saving (reactively)
      sharedTexts = sharedTexts.filter((_, i) => i !== currentIndex);
      localStorage.setItem("sharedTexts", JSON.stringify(sharedTexts));
      // Show the saved text in the editor
      currentIndex = newCurrentIndex;
      previewMode = false;
      // Remove ?share param from URL (avoid redeclaration)
      let url2 = new URL(window.location.href);
      url2.searchParams.delete("share");
      window.history.replaceState(
        {},
        document.title,
        url2.pathname + url2.search,
      );
    }
  }

  function onEditorClose() {
    currentIndex = null;
    mode = "mode-lecture";
    previewMode = false;
    // Re-read sharedTexts from localStorage to ensure reactivity after preview
    const storedShared = localStorage.getItem("sharedTexts");
    sharedTexts = storedShared ? JSON.parse(storedShared) : [];
    // Remove ?share param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("share");
    window.history.replaceState({}, document.title, url.pathname + url.search);
    document.body.className = mode;
    // update the meta tags
    updateMeta();
  }

  function newText() {
    texts = [...texts, { title: "", content: "" }];
    localStorage.setItem("texts", JSON.stringify(texts));
    openEditor(texts.length - 1);
    setMode("mode-edition");
  }

  function openEditor(i) {
    currentIndex = i;
    mode = "mode-lecture";
    document.body.className = mode;
  }

  function openSharedPreview(i) {
    currentIndex = i;
    mode = "mode-lecture";
    previewMode = true;
  }

  function deleteSharedText(i) {
    removeSharedText(i);
    // Remove from newly shared indexes and adjust other indexes
    newlySharedIndexes.delete(i);
    // Adjust indexes for items after the deleted one
    const newIndexes = new Set();
    newlySharedIndexes.forEach(index => {
      if (index > i) {
        newIndexes.add(index - 1);
      } else if (index < i) {
        newIndexes.add(index);
      }
    });
    newlySharedIndexes = newIndexes;
    
    // If deleting the currently previewed shared text, return to menu
    if (previewMode && currentIndex === i) {
      currentIndex = null;
      previewMode = false;
      mode = "mode-lecture";
    }
  }

  function setMode(m) {
    mode = m;
    document.body.className = mode;
  }

  function setTheme(t) {
    theme = t;
    document.body.dataset.theme = t;
    localStorage.setItem("theme", t);
  }

  function handleToggleSelectMode() {
    selectMode = !selectMode;
    if (!selectMode) selected = new Set();
  }

  function handleSelectItem(i) {
    if (selected.has(i)) {
      selected.delete(i);
    } else {
      selected.add(i);
    }
    selected = new Set(selected); // trigger reactivity
  }

  function handleDeleteSelection() {
    if (selected.size > 0) {
      texts = texts.filter((_, i) => !selected.has(i));
      localStorage.setItem("texts", JSON.stringify(texts));
      selected = new Set();
      selectMode = false;
    }
  }

  function handleShareSelection() {
    if (selected.size > 0) {
      const selectedTexts = Array.from(selected).map(i => texts[i]);
      const data = JSON.stringify(selectedTexts);
      const encoded = compress(data);
      const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      // Show some feedback (could be enhanced with a toast notification)
      alert(`Share link copied to clipboard! (${selected.size} texts)`);
    }
  }

  function handleClosePanel() {
    selectMode = false;
    setMode("mode-lecture");
  }
</script>

<main>
  {#if previewMode && sharedTexts.length}
    <Editor
      texts={sharedTexts}
      {currentIndex}
      {mode}
      {previewMode}
      localTexts={texts}
      onSave={save}
      onClose={onEditorClose}
      onSavePreviewText={savePreviewText}
    />
  {:else if currentIndex !== null}
    <Editor
      {texts}
      {currentIndex}
      {mode}
      previewMode={false}
      onSave={save}
      onClose={onEditorClose}
      onSavePreviewText={savePreviewText}
    />
  {:else}
    <Menu
      {texts}
      {sharedTexts}
      {newlySharedIndexes}
      onOpenEditor={openEditor}
      onOpenSharedPreview={openSharedPreview}
      onDeleteSharedText={deleteSharedText}
      {selectMode}
      {selected}
      onSelectItem={handleSelectItem}
      onDeleteSelection={handleDeleteSelection}
      onShareSelection={handleShareSelection}
    />
  {/if}
  <ActionPanel
    texts={previewMode && sharedTexts.length ? sharedTexts : texts}
    {mode}
    {currentIndex}
    {theme}
    onNewText={newText}
    onToggleMode={() =>
      setMode(mode === "mode-edition" ? "mode-lecture" : "mode-edition")}
    onToggleTheme={() => {
      const themes = ["auto", "light", "dark"];
      const idx = (themes.indexOf(theme) + 1) % themes.length;
      setTheme(themes[idx]);
    }}
    onClosePanel={handleClosePanel}
    showModeToggle={!previewMode}
    {selectMode}
    onToggleSelectMode={handleToggleSelectMode}
  />
</main>

<style>
  main {
    padding: 2em 1.5em;
    max-width: 650px;
    margin: auto;
  }
</style>
