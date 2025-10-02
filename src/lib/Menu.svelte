<script>
  export let texts = [];
  export let onOpenEditor;
</script>

<h1>Mes Textes</h1>
<ul>
  {#each texts as t, i}
    <li>
      <button
        type="button"
        on:click={() => onOpenEditor(i)}
        class={t.title ? "" : "untitled"}>{t.title || "Sans titre"}</button
      >
    </li>
  {/each}
</ul>

<style>
  h1,
  ul {
    font-family: "Newsreader", Georgia, "Times New Roman", serif;
  }

  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 0.8em 0;
    width: 100%;
    display: flex;
  }
  button {
    flex: 1;
    text-align: left;
    display: block;
    padding: 0.6em 1em;
    border-radius: 6px;
    text-decoration: none;
    color: var(--text-color);
    border: 1px solid var(--border-color);
    transition: background 0.2s;
    background: var(--bg-color);
    font-size: 1em;
  }
  button.untitled {
    font-style: italic;
    color: var(--text-muted-color);
  }
  button:hover {
    background: var(--hover-bg);
  }
</style>
