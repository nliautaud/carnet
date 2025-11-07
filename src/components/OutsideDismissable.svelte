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

  // Immediate close for non-touch pointers (mouse, stylus) on pointerdown (capture phase).
  function handlePointerDownCapture(e) {
    if (!open || !container) return;

    // if it's a touch pointer, defer to the click handler (so scroll gestures won't close).
    if (e.pointerType === "touch") return;

    if (!container.contains(e.target)) {
      onClose();
      if (blocking) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }

  // For touch devices (and general safety), close on capture-phase click.
  // Click fires for taps but not for scrolls — this avoids dismissing on touchstart when user intends to scroll.
  function handleClickCapture(e) {
    if (!open || !container) return;

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
    // pointerdown in capture phase for immediate non-touch handling
    document.addEventListener("pointerdown", handlePointerDownCapture, true);

    // click in capture phase for taps (works well on mobile; does NOT fire for scroll gestures)
    document.addEventListener("click", handleClickCapture, true);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDownCapture, true);
      document.removeEventListener("click", handleClickCapture, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

{#if open}
  <!-- When blocking is true, allow the backdrop to receive pointer events so it can intercept. -->
  <div
    class="backdrop"
    style="background: {backdropColor}; pointer-events: {blocking ? 'auto' : 'none'}"
    aria-hidden="true"
  >
  </div>

  <div class="container" bind:this={container} tabindex="-1">
    <slot />
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    /* pointer-events controlled inline depending on `blocking` prop */
  }

  .container {
    position: relative;
    pointer-events: auto;
    z-index: 10;
  }
</style>
