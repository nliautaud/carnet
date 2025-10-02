# minitms — README

A tiny local-first, mobile-first web app for writing and reading short texts (stories, song lyrics).
This document is the single source of truth for the project product spec and should be kept up to date.

---

# Project summary

**Goal:** provide a distraction-free, installable (PWA) reading + editing experience with a minimal UI. The app runs fully local (no server required), stores texts in the browser, supports a WYSIWYG content area, automatic saving, theme modes (auto/light/dark), and an action panel for quick actions.

**User-visible features (MVP):**

* Mobile-first interface with comfortable reading typography (serif, large font-size, large margins).
* Local-first: all data persisted to `localStorage` (JSON).
* Run as PWA (`manifest.json` + `sw.js`).
* Full-screen reading with minimal chrome.
* Action panel (fixed bottom-right) containing:

  * **New** (plus icon) — create a new text and open the editor.
  * **Theme** (cycles: Auto → Light → Dark) — shows an icon (🌗, ☀️, 🌙).
  * **Mode toggle** (Edit / View) — visible only when a text is open.
* Editor:

  * Title input (autofocus on new text).
  * WYSIWYG content area implemented with `contenteditable`.
  * Autosave: saves on every input while in edit mode.
* Reader:

  * Clean display of title and content (non-editable).
  * Simple control that returns to list.
* CSS uses modern architecture: CSS variables for theme colors, `body[data-theme]` controls theme, `body` includes classes for behavior.

**Primary constraints / design rules:**

* Minimalism and readability (book-like reading experience).
* No external network dependency for normal use.
* Local-first persistence and privacy: nothing is sent externally by default.
* Simple data model for compatibility and debugging.

---

# Data model

Stored in `localStorage` under key `"texts"`.

**`localStorage["texts"]`** — JSON array of objects:

```json
[
  {
    "title": "My Song",
    "content": "<p>First line<br>Second line</p>"
  },
  { "title": "", "content": "" }
]
```

* `title`: string (empty allowed)
* `content`: HTML string (from `contenteditable`, may include basic inline tags)
* All modifications should update the array and re-serialize with `JSON.stringify()`.

**Notes about content format and sanitization**

* The app currently writes `contenteditable.innerHTML` to storage. That gives WYSIWYG convenience but creates a risk if any external input is later rendered unsafely.
* When exporting/sharing, sanitize the HTML (strip `<script>`, `on*` attributes). Use a sanitizer (e.g. DOMPurify) if the app will export beyond local usage.

---

# Behavior / UX specifics (detailed)

1. **Startup**

   * When opening `index.html`, the app reads `localStorage["texts"]` (falls back to `[]`) and shows the menu list.
   * `body` initial attributes: `data-theme="auto"`, `class="mode-lecture"`.

2. **Action panel**

   * Fixed, rounded panel bottom-right.
   * Buttons (top to bottom):

     1. **New** (`＋`) — visible on the list. Creates a new text (empty title/content), appends to `texts`, opens editor focused on title, switches to `mode-edition`.
     2. **Mode toggle** (`✏️` / `👁`) — visible only when a text page is open. Toggles between `mode-edition` and `mode-lecture`. Icon changes to reflect current state.
     3. **Theme toggle** — always visible. Cycles: Auto → Light → Dark. Updates `document.body.dataset.theme` and button icon (🌗, ☀️, 🌙).

3. **List / Menu**

   * Displays each text as a blocky list item.
   * Clicking an item opens the editor/reader for that item.

4. **Open a text**

   * `openEditor(index)` shows title input and content div.
   * In `mode-edition`:

     * `title` is editable and focused for new texts.
     * `#content` has `contentEditable = true`.
     * Both `input` and `content` save to `texts[index]` on each `input` event (autosave).
   * In `mode-lecture`:

     * `title` and `#content` not editable.
     * The page content can still be selected for copy.

5. **Autosave**

   * Saves on `input` events only when `body.classList.contains('mode-edition')`.
   * Saves update `localStorage` immediately.

6. **Reader view**

   * When in lecture mode, the content is displayed without editing affordances.
   * A simple close control returns to list view.

7. **PWA**

   * `manifest.json` with icons and `display: standalone`.
   * `sw.js` caches basic assets to allow offline usage: `index.html`, `manifest.json`, icons, `sw.js`.
   * The site should be installable (Chrome/Firefox) with “Add to Home screen”.
