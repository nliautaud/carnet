import { StorageService } from './storageService.js'
import { compress, decompress } from '../lib/compression.js'
import { AppearanceService } from './appearanceService.js'

// Text management service
export class TextService {
  static findTextIndexByTitle(texts, title) {
    return texts.findIndex(
      (t) => t.title?.trim().toLowerCase() === title?.trim().toLowerCase()
    )
  }

  static createNewText() {
    return {
      title: '',
      content: '',
      font: AppearanceService.FONTS.SERIF,
      textSize: AppearanceService.TEXT_SIZE_DEFAULT
    }
  }

  static ensureTextHasAppearance(text) {
    // Migrate old texts that don't have appearance settings
    return {
      ...text,
      font: text.font || AppearanceService.FONTS.SERIF,
      textSize: text.textSize || AppearanceService.TEXT_SIZE_DEFAULT
    }
  }

  static saveText(texts, index, title, content, appearance) {
    if (index !== null && index >= 0 && index < texts.length) {
      const existingText = texts[index]
      texts[index] = {
        title,
        content,
        font: appearance?.font ?? existingText.font ?? AppearanceService.FONTS.SERIF,
        textSize: appearance?.textSize ?? existingText.textSize ?? AppearanceService.TEXT_SIZE_DEFAULT
      }
      StorageService.setTexts(texts)
      return texts
    }
    return texts
  }

  static addText(texts, text) {
    const newTexts = [...texts, text]
    StorageService.setTexts(newTexts)
    return newTexts
  }

  static deleteText(texts, index) {
    const newTexts = texts.filter((_, i) => i !== index)
    StorageService.setTexts(newTexts)
    return newTexts
  }

  static deleteTexts(texts, indexes) {
    const newTexts = texts.filter((_, i) => !indexes.has(i))
    StorageService.setTexts(newTexts)
    return newTexts
  }

  static generateUniqueTitle(baseTitle, existingTexts) {
    if (this.findTextIndexByTitle(existingTexts, baseTitle) === -1) {
      return baseTitle
    }

    let n = 2
    let newTitle = `${baseTitle} (${n})`
    while (this.findTextIndexByTitle(existingTexts, newTitle) !== -1) {
      n++
      newTitle = `${baseTitle} (${n})`
    }
    return newTitle
  }
}

// Shared text management service
export class SharedTextService {
  static addSharedText(sharedTexts, text) {
    const newSharedTexts = [...sharedTexts, text]
    StorageService.setSharedTexts(newSharedTexts)
    return newSharedTexts
  }

  static removeSharedText(sharedTexts, index) {
    const newSharedTexts = sharedTexts.filter((_, i) => i !== index)
    StorageService.setSharedTexts(newSharedTexts)
    return newSharedTexts
  }

  static processSharedData(shareParam) {
    try {
      const data = JSON.parse(decompress(shareParam))
      return Array.isArray(data) ? data : [data]
    } catch (error) {
      console.error('Error processing shared data:', error)
      return []
    }
  }

  static createShareUrl(texts) {
    const data = JSON.stringify(texts)
    const encoded = compress(data)
    return `${window.location.origin}${window.location.pathname}?share=${encoded}`
  }

  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      return false
    }
  }
}
