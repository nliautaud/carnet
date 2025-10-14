<script>
  import { ThemeService } from "../../services/themeService";
  import { theme } from "../../stores/appStore";
  import Moon from "./moon.svelte";
  import Moon2 from "./moon2.svelte";
  import Sun from "./sun.svelte";

  export let fill = "currentColor";
  export let classes = "";
</script>

{#if $theme === ThemeService.THEMES.AUTO}
  <Moon2 {fill} {classes} />
{:else if $theme === ThemeService.THEMES.LIGHT}
  <Sun {fill} {classes} />
{:else if $theme === ThemeService.THEMES.DARK}
  <Moon {fill} {classes} />
{/if}
