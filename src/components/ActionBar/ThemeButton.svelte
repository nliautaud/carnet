<script>
  import { EclipseIcon, MoonIcon, SunIcon } from "@lucide/svelte";
  import { StorageService } from "../../services/storageService.js";
  import { ThemeService } from "../../services/themeService.js";
  import { theme } from "../../stores/appStore.js";

  function handleToggleTheme() {
    const nextTheme = ThemeService.getNextTheme($theme);
    setTheme(nextTheme);
  }

  function setTheme(t) {
    theme.set(t);
    ThemeService.applyTheme(t);
    StorageService.setTheme(t);
  }

  // Get current theme display information
  $: currentThemeInfo = getThemeDisplayInfo($theme);

  function getThemeDisplayInfo(currentTheme) {
    const nextTheme = ThemeService.getNextTheme(currentTheme);

    if (currentTheme === ThemeService.THEMES.AUTO) {
      return {
        displayTheme: nextTheme,
        ariaLabel: `Switch to ${nextTheme} theme`,
        icon: nextTheme === ThemeService.THEMES.LIGHT ? SunIcon : MoonIcon
      };
    }
    return {
      displayTheme: ThemeService.THEMES.AUTO,
      ariaLabel: "Switch back to device theme",
      icon: EclipseIcon
    };
  }
</script>

<button
  class="btn-icon"
  id="toggle-theme"
  on:click={handleToggleTheme}
  aria-label={currentThemeInfo.ariaLabel}
  title={currentThemeInfo.ariaLabel}>
  <svelte:component this={currentThemeInfo.icon} />
</button>
