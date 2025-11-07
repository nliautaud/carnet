import { get, writable } from 'svelte/store'
import { actionBarOpen, currentIndex, mode, previewMode } from './appStore.js'
import { appearancePanelOpen } from './appearance.js'

export const menuFirstLoad = writable(true)
export const showAbout = writable(false)

export function setupHistoryNavigation() {
  let previousIndex = get(currentIndex)

  // Ensure initial history state always has an index field (so popstate event.state is consistent)
  try {
    window.history.replaceState({ index: previousIndex }, document.title)
  } catch (e) {
    // ignore (some environments may disallow replaceState)
  }

  // Handle browser back/forward: set currentIndex based on state.index (or null)
  const handlePopState = (event) => {
    const state = event.state
    const newIndex = (state && typeof state.index !== 'undefined') ? state.index : null

    // Only update when different to avoid redundant sets
    if (get(currentIndex) !== newIndex) {
      currentIndex.set(newIndex)
    }
    cleanState()
  }

  window.addEventListener('popstate', handlePopState)

  const unsubscribe = currentIndex.subscribe((index) => {
    // Only push state when transitioning from null to non-null (opening a text)
    if (index !== null && previousIndex === null) {
      // include the index so popstate can restore the exact item
      window.history.pushState({ index }, document.title)
    }

    // Detect first menu show (when index goes from non-null to null)
    // Keep the existing menuFirstLoad value in consideration
    menuFirstLoad.set(index === null && previousIndex === null && get(menuFirstLoad))

    previousIndex = index
  })

  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState)
    unsubscribe()
  }
}

// Programmatic navigation helper to go back to the menu
export function goToMenu(about = false) {
  try {
    // Try to push a menu state so history stays consistent
    window.history.pushState({ index: null }, document.title)
  } catch (e) {
    // ignore environments that disallow pushState
  }

  currentIndex.set(null)
  if (about) {
    menuFirstLoad.set(false)
    showAbout.set(true)
  }
  cleanState()
}

function cleanState() {
  mode.set('mode-lecture')
  actionBarOpen.set(false)
  previewMode.set(false)
  appearancePanelOpen.set(false)
}

export function closeAbout() {
  showAbout.set(false)
  if (window.history.length > 1) {
    window.history.back()
  } else {
    goToMenu()
  }
}