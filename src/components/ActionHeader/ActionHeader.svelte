<script>
  import { actionBarOpen, mode } from "../../stores/appStore.js";
  import ActionBar from "../ActionBar/ActionBar.svelte";
  import { ChevronLeftIcon, SparkleIcon } from "@lucide/svelte";
  import OutsideDismissable from "../OutsideDismissable.svelte";

  export let onBack = null;
  export let showBackButton = false;

  function handleMenuClick() {
    actionBarOpen.update((open) => !open);
  }

  function handleBack() {
    if (onBack) {
      onBack();
    }
  }
</script>

<div class="action-header" class:actionbar-visible={$actionBarOpen}>
  <div class="header-buttons left" class:fade-out={$actionBarOpen}>
    {#if showBackButton}
      <button class="btn-icon" on:click={handleBack} aria-label="Back">
        <ChevronLeftIcon />
      </button>
    {/if}
  </div>

  <div class="action-bar-container" class:visible={$actionBarOpen}>
    <OutsideDismissable
      open={$actionBarOpen}
      onClose={() => actionBarOpen.set(false)}>
      <ActionBar />
    </OutsideDismissable>
  </div>

  <div class="header-buttons right" class:fade-out={$actionBarOpen}>
    <button
      class="btn-icon menu-button"
      on:click={handleMenuClick}
      aria-label="Menu">
      <SparkleIcon />
    </button>
  </div>
</div>

<style>
  .action-header {
    position: relative;
    padding: 0.5em 0 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    min-height: 80px;
  }

  .header-buttons {
    display: flex;
    align-items: center;
    gap: 0.5em;
    opacity: 1;
    transition: opacity 0.2s ease-out;
    pointer-events: auto;
  }

  .header-buttons.fade-out {
    opacity: 0;
    pointer-events: none;
  }

  .action-bar-container {
    position: absolute;
    top: 1.5em;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s cubic-bezier(0.47, 1.64, 0.41, 0.8);
    z-index: 100;
  }

  .action-bar-container.visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* action bar sticky */
  .action-header.actionbar-visible {
    position: sticky;
    top: 0;
    z-index: 100;
    border-radius: 1em 1em 0 0;
  }
</style>
