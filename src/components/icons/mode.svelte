<script>
  import { mode } from "../../stores/appStore";
  import EditIcon from "./edit.svelte";
  import EyeIcon from "./eye.svelte";
</script>

{#if $mode === "mode-lecture"}
  <EditIcon />
{:else if $mode === "mode-edition"}
  <EyeIcon />
{/if}
