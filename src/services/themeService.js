export class ThemeService {
  static THEMES = Object.freeze({
    AUTO: 'auto',
    LIGHT: 'light',
    DARK: 'dark'
  });
  static THEME_ICONS = ['🌗', '☀️', '🌙'];

  static canDetectColorScheme() {
    return typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches !== undefined
  }

  static getSystemColorScheme() {
    if (!this.canDetectColorScheme()) return null
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  static getAvailableThemes() {
    if (!this.canDetectColorScheme()) {
      // Fallback to original three options when detection isn't available
      return [this.THEMES.AUTO, this.THEMES.LIGHT, this.THEMES.DARK]
    }

    const systemScheme = this.getSystemColorScheme()
    const oppositeScheme = systemScheme === 'dark' ? this.THEMES.LIGHT : this.THEMES.DARK

    // Return auto and the opposite of system preference
    return [this.THEMES.AUTO, oppositeScheme]
  }

  static getNextTheme(currentTheme) {
    const availableThemes = this.getAvailableThemes()
    const currentIndex = availableThemes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % availableThemes.length
    return availableThemes[nextIndex]
  }
  static getThemeIcon(theme) {
    const themesArray = Object.values(this.THEMES)
    const index = themesArray.indexOf(theme)
    return this.THEME_ICONS[index] || '🌗'
  }

  static applyTheme(theme) {
    document.body.dataset.theme = theme
  }

  static applyMode(mode) {
    document.body.className = mode
  }
}
