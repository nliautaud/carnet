import { writable } from 'svelte/store'
import { AppearanceService } from '../services/appearanceService'

// Current text's appearance settings
// @ts-ignore - Type will be union of all font values
export const currentFont = writable(/** @type {'serif' | 'sans' | 'mono'} */(AppearanceService.FONTS.SERIF))
export const currentTextSize = writable(AppearanceService.TEXT_SIZE_DEFAULT)
export const appearancePanelOpen = writable(false)
