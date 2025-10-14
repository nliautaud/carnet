export class ThemeService {
  static THEMES = Object.freeze({
    AUTO: 'auto',
    LIGHT: 'light',
    DARK: 'dark'
  });
  static THEME_ICONS = ['🌗', '☀️', '🌙'];

  static getNextTheme(currentTheme) {
    const themesArray = Object.values(this.THEMES)
    const currentIndex = themesArray.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themesArray.length
    return themesArray[nextIndex];
  }
  static getThemeIcon(theme) {
    const themesArray = Object.values(this.THEMES)
    const index = themesArray.indexOf(theme);
    return this.THEME_ICONS[index] || '🌗';
  }

  static applyTheme(theme) {
    document.body.dataset.theme = theme;
  }

  static applyMode(mode) {
    document.body.className = mode;
  }
}
