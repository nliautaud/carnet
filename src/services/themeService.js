export class ThemeService {
  static THEMES = Object.freeze({
    AUTO: 'auto',
    LIGHT: 'light',
    DARK: 'dark'
  });

  static getSystemColorScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  static getAvailableThemes() {
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

  static applyTheme(theme) {
    document.body.dataset.theme = theme
  }

  static applyMode(mode) {
    document.body.className = mode
  }
}
