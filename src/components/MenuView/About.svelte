<script>
  import { GithubIcon, UserRoundIcon } from "@lucide/svelte";
</script>

<div class="about">
  <p>
    <span class="carnet">Carnet</span> is a lightweight, distraction-free, local-first
    notebook for short texts or thoughts you want to keep close, designed to feel
    calm, focused and personnal.
  </p>
  <p class="links">
    <a href="https://nliautaud.fr" target="_blank" rel="noopener"
      ><UserRoundIcon /> <span>Nicolas Liautaud</span></a>
    <br />
    <a href="https://github.com/nliautaud/carnet" target="_blank" rel="noopener"
      ><GithubIcon /> <span>Github</span></a>
  </p>
</div>

<style>
  .about {
    color: var(--text-muted-color);
    font-size: 0.9em;
    margin-top: 3em;
    text-align: center;
  }

  .carnet {
    font-family: var(--font-serif);
    font-weight: bold;
    color: var(--text-color);
  }

  .links a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    color: var(--text-muted-color);
    text-decoration: underline;
    transition: color 0.2s ease-out;
  }

  .links a:hover {
    color: var(--text-color);
  }
</style>
