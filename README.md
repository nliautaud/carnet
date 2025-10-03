
# Carnet

**Carnet** is a lightweight, distraction-free, local-first notebook for short texts or thoughts you want to keep close, designed to feel calm, focused and personnal.

### Simple Reading

* Opens in a clean reading mode by default
* No toolbars, popups, or menus in the way
* Switch to edit mode only when you need it
* Typography and layout tuned for relaxed reading

### Effortless Writing

* Create and edit directly in place
* Auto-save after every change
* No buttons, dialogs, or extra steps

### Local First

* No sign-up, no accounts, no servers
* Texts are stored in the browser
* Available offline and installable as a PWA

### Easy Sharing

* Share or import texts using links
* Preview, overwrite or copy the shared texts
* Works without any backend infrastructure


## Why Carnet?

I built Carnet because I wanted a quiet space for small pieces of writing. Simple notes, song lyrics, or fragments that didn’t fit in bigger apps.

Just a clean fullscreen page that opens fast and stays out of the way. A simple list that I can choose from and start reading, with good typography and a dark mode for the evenings. Content that I could edit without any hassle, without accounts, logins, or any kind of cloud dependency. That I could share by simply sending a link to someone.

Carnet came out of all of that. It’s a personal tool that does one thing well: keep some words close.


## Installation

1. Open Carnet in Chrome, Firefox, or Edge on mobile.
2. Tap the browser menu and choose **Add to Home Screen**.
3. Launch from your home screen to use it full-screen, without browser UI.

The app will work offline after the first load.

## Technical Overview

Carnet is intentionally minimal.

* **Framework:** [Svelte](https://svelte.dev/) + [Vite](https://vitejs.dev/)
* **Storage:** Browser `localStorage` (no backend)
* **Offline support:** Progressive Web App (PWA)
* **Sharing:** URL compression with [lz-string](https://github.com/pieroxy/lz-string)
* **Build size:** Minimal, only lz-string bundled-in


## Product Philosophy

Don't try to replace a notes app or word processor.
It’s for the small things that you keep close on a few pages of a personnal *carnet*.

Some guiding principles:

* **Focus over features:** every element earns its place.
* **Local-first by design:** your data never leaves your device.
* **Readable before editable:** always start by reading, not editing.
* **Durable:** no dependencies on APIs, accounts, or servers.

## Getting Started

```bash
pnpm install
pnpm run dev
```

## Data

All texts are stored in `localStorage` as a JSON array.
Carnet saves automatically as you type. Nothing is uploaded or synced remotely.
If you clear browser data, your notes will be removed — export before doing so.


## License

MIT License.
You are free to use, modify, and distribute Carnet as you wish.
