import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

// inject tracking script in production builds
if (import.meta.env.PROD) {
  const s = document.createElement('script')
  s.defer = true
  s.src = 'https://stats.nliautaud.fr/script.js'
  s.setAttribute('data-website-id', '59a85078-d235-4e0b-b0d6-b03c0b7b6f9d')
  document.head.appendChild(s)
}

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
