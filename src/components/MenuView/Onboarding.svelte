<script>
  import { SparkleIcon } from "@lucide/svelte";
</script>

<div class="onboarding">
  <p class="instruction">
    Press the <span class="icon"><SparkleIcon /></span> button at the top to create
    your first text. This is the only interface element you will ever need.
  </p>
</div>

<style>
  .onboarding {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .instruction {
    text-align: center;
    color: var(--color-text-secondary, #666);
    max-width: 18em;
    font-size: 0.9em;
    opacity: 0.8;
    margin-top: 4em;
  }
  .icon {
    display: inline-flex;
    vertical-align: middle;
    margin-right: 0.2em;
    background: var(--panel-bg);
    border-radius: 0.4em;
    padding: 0.15em 0.4em;
  }
</style>
