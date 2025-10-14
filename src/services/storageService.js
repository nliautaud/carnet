import { ThemeService } from "./themeService"

export class StorageService {
  static KEYS = {
    TEXTS: 'texts',
    SHARED_TEXTS: 'sharedTexts',
    THEME: 'theme'
  };

  static getTexts() {
    try {
      const stored = localStorage.getItem(this.KEYS.TEXTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading texts from storage:', error);
      return [];
    }
  }

  static setTexts(texts) {
    try {
      localStorage.setItem(this.KEYS.TEXTS, JSON.stringify(texts));
    } catch (error) {
      console.error('Error saving texts to storage:', error);
    }
  }

  static getSharedTexts() {
    try {
      const stored = localStorage.getItem(this.KEYS.SHARED_TEXTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading shared texts from storage:', error);
      return [];
    }
  }

  static setSharedTexts(sharedTexts) {
    try {
      localStorage.setItem(this.KEYS.SHARED_TEXTS, JSON.stringify(sharedTexts));
    } catch (error) {
      console.error('Error saving shared texts to storage:', error);
    }
  }

  static getTheme() {
    try {
      return localStorage.getItem(this.KEYS.THEME) || ThemeService.THEMES.AUTO;
    } catch (error) {
      console.error('Error loading theme from storage:', error);
      return ThemeService.THEMES.AUTO;
    }
  }

  static setTheme(theme) {
    try {
      localStorage.setItem(this.KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme to storage:', error);
    }
  }
}
