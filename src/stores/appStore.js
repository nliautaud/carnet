import { writable } from 'svelte/store';

// Application state stores
export const texts = writable([]);
export const sharedTexts = writable([]);
export const currentIndex = writable(null);
export const mode = writable('mode-lecture'); // 'mode-lecture' or 'mode-edition'
export const theme = writable('auto'); // 'auto', 'light', 'dark'
export const previewMode = writable(false);
export const selectMode = writable(false);
export const selected = writable(new Set());
export const newlySharedIndexes = writable(new Set());

// Derived stores
export const currentText = writable(null);
export const isEditorOpen = writable(false);
export const hasSharedTexts = writable(false);

// Store subscriptions for derived values
texts.subscribe(() => {
  // Update derived stores when texts change
});

currentIndex.subscribe((index) => {
  texts.subscribe((textsArray) => {
    if (index !== null && textsArray[index]) {
      currentText.set(textsArray[index]);
    } else {
      currentText.set(null);
    }
  });
});

sharedTexts.subscribe((shared) => {
  hasSharedTexts.set(shared.length > 0);
});

currentIndex.subscribe((index) => {
  isEditorOpen.set(index !== null);
});
