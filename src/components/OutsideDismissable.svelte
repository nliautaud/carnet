<!-- OutsideDismissable.svelte

Svelte 5 component that closes when you click anywhere outside the component
using a capture-phase `pointerdown` listener so that the original click still
reaches the underlying target. No blocking overlay is used.

Props:
- `open` (boolean) — whether the component is visible
- `onClose` (function) — callback called when an outside click or Escape should close

Usage:
import OutsideDismissable from './OutsideDismissable.svelte';
<OutsideDismissable {open} onClose={() => open = false}>
  component content here
</OutsideDismissable>
-->

<script>
  import { onMount } from "svelte";

  export let open = false;
  export let onClose = () => {};
  export let backdropColor = "transparent";
  export let blocking = false; // if true, backdrop intercepts clicks

  let container;

  function handlePointerDownCapture(e) {
    if (!open) return;
    if (!container) return;

    if (!container.contains(e.target)) {
      onClose();
      if (blocking) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === "Escape") {
      onClose();
    }
  }

  onMount(() => {
    // capture-phase pointer handler so we see the pointerdown BEFORE the target
    document.addEventListener("pointerdown", handlePointerDownCapture, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDownCapture,
        true
      );
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

{#if open}
  <div class="backdrop" style="background: {backdropColor}" aria-hidden="true">
  </div>
  <div class="container" bind:this={container} tabindex="-1">
    <slot />
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  .container {
    position: relative;
    pointer-events: auto;
    z-index: 10;
  }
</style>
