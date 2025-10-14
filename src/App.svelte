<script>
  import { onMount } from "svelte";
  import "./app.css";

  import { StorageService } from "./services/storageService.js";
  import { SharedTextService } from "./services/textService.js";
  import { ThemeService } from "./services/themeService.js";

  import {
      currentIndex,
      mode,
      newlySharedIndexes,
      previewMode,
      sharedTexts,
      texts,
      theme,
  } from "./stores/appStore.js";

  import TextMenu from "./components/MenuView/Menu.svelte";
  import TextEditor from "./components/TextView/TextView.svelte";
// Utils
  import { updateMeta } from "./lib/meta.js";

  // Initialize app
  onMount(() => {
    initializeApp();
  });

  async function initializeApp() {
    // Load data from storage
    texts.set(StorageService.getTexts());
    sharedTexts.set(StorageService.getSharedTexts());
    theme.set(StorageService.getTheme());

    // Apply initial theme and mode
    ThemeService.applyTheme($theme);
    ThemeService.applyMode("mode-lecture");

    // Handle share parameter
    await handleShareParameter();

    // Update meta tags
    updateMeta();
  }

  async function handleShareParameter() {
    const params = new URLSearchParams(window.location.search);
    const share = params.get("share");

    if (share) {
      try {
        const data = SharedTextService.processSharedData(share);
        if (data.length > 0) {
          const startIndex = $sharedTexts.length;

          // Add shared texts
          for (const text of data) {
            sharedTexts.update((shared) =>
              SharedTextService.addSharedText(shared, text),
            );
          }

          // Mark newly added texts as featured
          const newIndexes = new Set();
          for (let i = startIndex; i < $sharedTexts.length; i++) {
            newIndexes.add(i);
          }
          newlySharedIndexes.set(newIndexes);

          // Handle preview mode
          if (data.length === 1) {
            currentIndex.set($sharedTexts.length - 1);
            mode.set("mode-lecture");
            previewMode.set(true);
          } else {
            currentIndex.set(null);
            mode.set("mode-lecture");
            previewMode.set(false);
          }

          // Clean URL
          cleanUrl();
        }
      } catch (error) {
        console.error("Error processing shared data:", error);
      }
    }
  }

  function cleanUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete("share");
    window.history.replaceState({}, document.title, url.pathname + url.search);
  }
</script>

<main>
  {#if ($previewMode && $sharedTexts.length) || $currentIndex !== null}
    <TextEditor />
  {:else}
    <TextMenu />
  {/if}
</main>

<style>
  main {
    position: relative;
    margin: 2em;
    padding: 2em 1.5em;
    background: var(--bg-color-gradient);
    border-radius: 1em;
    color: var(--text-color);
    transition:
      background 0.3s,
      color 0.3s;
      min-height: 1000px;
  }
  
  /* On smaller heights, make main full height */
  @media (max-height: 1200px) {
    main {
      flex: 1;
      min-height: auto;
    }
    :global(#app),
    :global(body) {
      align-items: stretch;
    }
  }
  
  /* Mobile responsive */
  @media (max-width: 750px) {
    main {
      border-radius: 0;
      margin: 0;
      min-height: 100vh;
    }
  }
</style>
