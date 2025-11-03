export class AppearanceService {
  static FONTS = Object.freeze({
    SERIF: 'serif',
    SANS: 'sans',
    MONO: 'mono'
  });

  static FONT_FAMILIES = Object.freeze({
    serif: 'var(--font-serif)',
    sans: 'var(--font-system)',
    mono: '"Courier New", Courier, monospace'
  });

  static TEXT_SIZE_MIN = 16;
  static TEXT_SIZE_MAX = 32;
  static TEXT_SIZE_DEFAULT = 22;
  static TEXT_SIZE_STEP = 2;

  static applyFont(font) {
    const fontFamily = this.FONT_FAMILIES[font] || this.FONT_FAMILIES.serif
    document.documentElement.style.setProperty('--content-font', fontFamily)
  }

  static applyTextSize(size) {
    // Apply size only to content elements via CSS variable
    document.documentElement.style.setProperty('--content-font-size', `${size}px`)
  }

  static getFontFamily(font) {
    return this.FONT_FAMILIES[font] || this.FONT_FAMILIES.serif
  }

  static increaseTextSize(currentSize) {
    return Math.min(currentSize + this.TEXT_SIZE_STEP, this.TEXT_SIZE_MAX)
  }

  static decreaseTextSize(currentSize) {
    return Math.max(currentSize - this.TEXT_SIZE_STEP, this.TEXT_SIZE_MIN)
  }
}
