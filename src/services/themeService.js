export class ThemeService {
  static THEMES = ['auto', 'light', 'dark'];
  static THEME_ICONS = ['🌗', '☀️', '🌙'];

  static getNextTheme(currentTheme) {
    const currentIndex = this.THEMES.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % this.THEMES.length;
    return this.THEMES[nextIndex];
  }

  static getThemeIcon(theme) {
    const index = this.THEMES.indexOf(theme);
    return this.THEME_ICONS[index] || '🌗';
  }

  static applyTheme(theme) {
    document.body.dataset.theme = theme;
  }

  static applyMode(mode) {
    document.body.className = mode;
  }
}
