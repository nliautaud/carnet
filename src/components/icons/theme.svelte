<script>
  import { ThemeService } from "../../services/themeService";
  import { theme as globalTheme } from "../../stores/appStore";
  import Moon from "./moon.svelte";
  import Moon2 from "./moon2.svelte";
  import Sun from "./sun.svelte";

  export let fill = "currentColor";
  export let classes = "";
  export let theme = null; // Optional theme override

  // Use provided theme or fall back to global theme
  $: activeTheme = theme || $globalTheme;
</script>

{#if activeTheme === ThemeService.THEMES.AUTO}
  <Moon2 {fill} {classes} />
{:else if activeTheme === ThemeService.THEMES.LIGHT}
  <Sun {fill} {classes} />
{:else if activeTheme === ThemeService.THEMES.DARK}
  <Moon {fill} {classes} />
{/if}
