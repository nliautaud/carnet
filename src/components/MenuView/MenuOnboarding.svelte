<script>
  import Menu from "../icons/menu.svelte";
</script>

<div class="onboarding">
  <div class="message">
    <p class="void-text">The void awaits...</p>
    <p class="instruction">
      Press the <span class="icon"><Menu /></span> button at the top to create your
      first text. This is the only interface element you will ever need.
    </p>
    <p class="author">
      <em>Carnet</em> by
      <a href="https://nliautaud.fr" target="_blank" rel="noopener"
        >Nicolas Liautaud</a
      >
      -
      <a
        href="https://github.com/nliautaud/carnet"
        target="_blank"
        rel="noopener">Github</a
      >
    </p>
  </div>
</div>

<style>
  .onboarding {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .message {
    text-align: center;
    color: var(--color-text-secondary, #666);
    max-width: 18em;
  }

  .void-text {
    font-family: var(--font-serif);
    font-size: 1.2em;
    font-style: italic;
    margin: 4em 0;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
  }

  .instruction {
    font-size: 0.9em;
    opacity: 0.8;
  }
  .icon {
    display: inline-flex;
    vertical-align: middle;
    margin-right: 0.2em;
    background: var(--panel-bg);
    border-radius: 0.4em;
    padding: 0.15em 0.4em;
  }

  .author {
    font-size: 0.8em;
    opacity: 0.6;
    margin-top: 3em;
    position: absolute;
    bottom: 1em;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .author a {
    color: var(--color-text-secondary, #666);
    text-decoration: underline;
  }

  .author a:hover {
    opacity: 1;
  }
</style>
