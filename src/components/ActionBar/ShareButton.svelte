<script>
  import { createEventDispatcher } from "svelte";
  import { compress } from "../../lib/compression.js";
  import { SharedTextService } from "../../services/textService.js";
  import { ShareIcon } from "@lucide/svelte";

  export let title = "";
  export let content = "";

  const dispatch = createEventDispatcher();
  let copying = false;

  async function handleShare() {
    const data = JSON.stringify([{ title, content }]);
    const encoded = compress(data);
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`;

    const success = await SharedTextService.copyToClipboard(shareUrl);
    if (success) {
      copying = true;
      setTimeout(() => (copying = false), 1200);
      dispatch("shared");
    }
  }
</script>

<button
  type="button"
  class="btn-icon"
  on:click={handleShare}
  aria-label="Share this text">
  <ShareIcon />
  {#if copying}
    <span class="copied-label">Copied!</span>
  {/if}
</button>

<style>
  .copied-label {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--panel-bg);
    color: var(--text-muted-color);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.6em;
    font-style: italic;
    pointer-events: none;
  }
</style>
