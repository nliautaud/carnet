<script>
  import { onMount } from "svelte";
  import "./app.css";
  import ActionPanel from "./lib/ActionPanel.svelte";
  import Editor from "./lib/Editor.svelte";
  import Menu from "./lib/Menu.svelte";
  import { decompress } from "./lib/compression";
  import { updateMeta } from "./lib/meta";

  let texts = [];
  let sharedTexts = [];
  let currentIndex = null;
  let mode = "mode-lecture"; // or 'mode-edition'
  let theme = "auto";
  let previewMode = false;
  let selectMode = false;
  let selected = new Set();

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
        addSharedText(data);
        currentIndex = sharedTexts.length - 1;
        mode = "mode-lecture";
        previewMode = true;
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
  function savePreviewText(event) {
    const detail = event?.detail;
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
      on:setMode={(e) => setMode(e.detail)}
      on:savePreviewText={savePreviewText}
    />
  {:else if currentIndex !== null}
    <Editor
      {texts}
      {currentIndex}
      {mode}
      previewMode={false}
      onSave={save}
      onClose={onEditorClose}
      on:setMode={(e) => setMode(e.detail)}
      on:savePreviewText={savePreviewText}
    />
  {:else}
    <Menu
      {texts}
      {sharedTexts}
      onOpenEditor={openEditor}
      onOpenSharedPreview={openSharedPreview}
      onDeleteSharedText={deleteSharedText}
      {selectMode}
      {selected}
      onToggleSelectMode={handleToggleSelectMode}
      onSelectItem={handleSelectItem}
      onDeleteSelection={handleDeleteSelection}
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
