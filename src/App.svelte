<script>
  import { onMount } from "svelte";
  import "./app.css";
  import ActionPanel from "./lib/ActionPanel.svelte";
  import Editor from "./lib/Editor.svelte";
  import Menu from "./lib/Menu.svelte";

  let texts = [];
  let sharedTexts = [];
  let currentIndex = null;
  let mode = "mode-lecture"; // or 'mode-edition'
  let theme = "auto";
  let previewMode = false;

  // Helper to decode base64url
  function decodeBase64Url(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return decodeURIComponent(escape(atob(str)));
  }

  // Load from localStorage or from share param
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const share = params.get("share");
    const stored = localStorage.getItem("texts");
    texts = stored ? JSON.parse(stored) : [];
    if (share) {
      try {
        const data = JSON.parse(decodeBase64Url(share));
        sharedTexts = [data];
        currentIndex = 0;
        mode = "mode-lecture";
        previewMode = true;
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
      (t) => t.title?.trim().toLowerCase() === title?.trim().toLowerCase()
    );
  }

  // Save preview: support override or save as new
  function savePreviewText({ detail } = {}) {
    if (previewMode && sharedTexts.length && typeof currentIndex === "number") {
      const toSave = sharedTexts[currentIndex];
      let all = [...texts];
      const existingIdx = findTextIndexByTitle(toSave.title);
      if (detail === 'override' && existingIdx !== -1) {
        // Override existing
        all[existingIdx] = toSave;
        localStorage.setItem("texts", JSON.stringify(all));
        texts = all;
        currentIndex = existingIdx;
      } else if (detail === 'new' && existingIdx !== -1) {
        // Save as new with suffix
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
        currentIndex = all.length - 1;
      } else {
        // Normal save
        all.push(toSave);
        localStorage.setItem("texts", JSON.stringify(all));
        texts = all;
        currentIndex = all.length - 1;
      }
      previewMode = false;
      sharedTexts = [];
      // Remove ?share param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("share");
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }

  function showMenu() {
    currentIndex = null;
    mode = "mode-lecture";
    previewMode = false;
    sharedTexts = [];
    // Remove ?share param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("share");
    window.history.replaceState({}, document.title, url.pathname + url.search);
    document.body.className = mode;
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

  function setMode(m) {
    mode = m;
    document.body.className = mode;
  }

  function setTheme(t) {
    theme = t;
    document.body.dataset.theme = t;
    localStorage.setItem("theme", t);
  }
</script>

<main>
  {#if previewMode && sharedTexts.length}
    <Editor
      texts={sharedTexts}
      {currentIndex}
      {mode}
      previewMode={previewMode}
      localTexts={texts}
      onSave={save}
      onClose={showMenu}
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
      onClose={showMenu}
      on:setMode={(e) => setMode(e.detail)}
      on:savePreviewText={savePreviewText}
    />
  {:else}
    <Menu {texts} onOpenEditor={openEditor} />
  {/if}
  <ActionPanel
    {texts}
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
    onClosePanel={() => setMode("mode-lecture")}
  />
</main>

<style>
  main {
    padding: 2em 1.5em;
    max-width: 650px;
    margin: auto;
  }
</style>
