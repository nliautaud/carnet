<script>
  export let title = "";
  export let content = "";
  import { compress } from './compression';
  let copying = false;

  function handleShare() {
    const data = JSON.stringify({ title, content });
    const encoded = compress(data);
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    navigator.clipboard.writeText(shareUrl);
    copying = true;
    setTimeout(() => (copying = false), 1200);
  }
</script>

<button
  class="share-btn-actionpanel"
  type="button"
  on:click={handleShare}
  aria-label="Share this text"
>
  🔗
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
