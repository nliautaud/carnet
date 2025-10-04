<script>
  export let onClose;
</script>

<button class="close" type="button" on:click={onClose} aria-label="Fermer">
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <line
      x1="5"
      y1="5"
      x2="15"
      y2="15"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="15"
      y1="5"
      x2="5"
      y2="15"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</button>

<style>
  .close {
    position: fixed;
    right: 36px;
    background: none;
    border: none;
    color: var(--text-color);
  }
</style>
