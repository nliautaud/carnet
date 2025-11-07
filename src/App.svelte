<script>
  import { onMount, onDestroy } from "svelte";
  import "./app.css";

  import { StorageService } from "./services/storageService.js";
  import { SharedTextService, TextService } from "./services/textService.js";
  import { ThemeService } from "./services/themeService.js";

  import {
      currentIndex,
      mode,
      newlySharedIndexes,
      previewMode,
      sharedTexts,
      texts,
      theme,
      menuFirstLoad,
  } from "./stores/appStore.js";

  import TextMenu from "./components/MenuView/Menu.svelte";
  import TextEditor from "./components/TextView/TextView.svelte";
  import AppearancePanel from "./components/AppearancePanel.svelte";
  // Utils
  import { updateMeta } from "./lib/meta.js";

  let cleanupHistory;

  // Initialize app
  onMount(() => {
    initializeApp();
    cleanupHistory = setupHistoryNavigation();
  });

  onDestroy(() => {
    if (cleanupHistory) {
      cleanupHistory();
    }
  });

  async function initializeApp() {
    // Load data from storage and migrate old texts
    const loadedTexts = StorageService.getTexts().map(TextService.ensureTextHasAppearance);
    const loadedSharedTexts = StorageService.getSharedTexts().map(TextService.ensureTextHasAppearance);
    
    texts.set(loadedTexts);
    sharedTexts.set(loadedSharedTexts);
    theme.set(StorageService.getTheme());

    // Save migrated texts if needed
    if (loadedTexts.length > 0) {
      StorageService.setTexts(loadedTexts);
    }
    if (loadedSharedTexts.length > 0) {
      StorageService.setSharedTexts(loadedSharedTexts);
    }

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

  function setupHistoryNavigation() {
    let previousIndex = $currentIndex;

    // Handle browser back button
    const handlePopState = (event) => {
      // Only handle if we're viewing a text and the state indicates text view navigation
      if ($currentIndex !== null && (event.state?.textView || event.state === null)) {
        currentIndex.set(null);
        mode.set("mode-lecture");
        previewMode.set(false);
      }
    };
    
    window.addEventListener('popstate', handlePopState);

    // Subscribe to currentIndex changes to manage history and menu animation
    const unsubscribe = currentIndex.subscribe((index) => {
      // Only push state when transitioning from null to non-null (opening a text)
      if (index !== null && previousIndex === null) {
        window.history.pushState({ textView: true }, document.title);
      }
      // Detect first menu show (when index goes from non-null to null)
      menuFirstLoad.set(index === null && previousIndex === null && $menuFirstLoad);
      previousIndex = index;
    });

    // Return cleanup function
    return () => {
      window.removeEventListener('popstate', handlePopState);
      unsubscribe();
    };
  }
</script>

<main class={$menuFirstLoad ? "animate" : ""}>
  {#if ($previewMode && $sharedTexts.length) || $currentIndex !== null}
    <TextEditor />
  {:else}
    <TextMenu />
  {/if}
</main>

<AppearancePanel />

<style>
  main {
    position: relative;
    margin: 2em;
    padding: 4%;
    color: var(--text-color);
    transition:
      color 0.3s,
      transform 0.3s cubic-bezier(0.47, 1.64, 0.41, 0.8);
    min-height: 1000px;
    transform: translateX(var(--content-shift, 0));
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
    }
  }
</style>
