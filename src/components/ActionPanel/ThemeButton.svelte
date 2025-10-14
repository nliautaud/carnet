<script>
  import { StorageService } from "../../services/storageService.js";
  import { ThemeService } from "../../services/themeService.js";
  import { theme } from "../../stores/appStore.js";
  import ThemeIcon from "../icons/theme.svelte";

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
    const availableThemes = ThemeService.getAvailableThemes();
    const nextTheme = ThemeService.getNextTheme(currentTheme);

    // Determine what the button should show
    let displayTheme = currentTheme;
    let ariaLabel = "Toggle theme";

    if (availableThemes.length === 2) {
      // When only 2 options (auto + opposite), show what will be next
      const systemScheme = ThemeService.getSystemColorScheme();
      if (currentTheme === ThemeService.THEMES.AUTO) {
        displayTheme = nextTheme; // Show the manual option
        ariaLabel = `Switch to ${nextTheme} theme`;
      } else {
        displayTheme = ThemeService.THEMES.AUTO; // Show auto when manual is selected
        ariaLabel = "Switch to auto theme";
      }
    } else {
      // When 3 options available, show current
      const themeNames = {
        [ThemeService.THEMES.AUTO]: "auto",
        [ThemeService.THEMES.LIGHT]: "light",
        [ThemeService.THEMES.DARK]: "dark",
      };
      ariaLabel = `Current: ${themeNames[currentTheme] || "auto"}, click to change`;
    }

    return { displayTheme, ariaLabel };
  }
</script>

<button
  class="btn-icon"
  id="toggle-theme"
  on:click={handleToggleTheme}
  aria-label={currentThemeInfo.ariaLabel}
  title={currentThemeInfo.ariaLabel}
>
  <ThemeIcon theme={currentThemeInfo.displayTheme} />
</button>
