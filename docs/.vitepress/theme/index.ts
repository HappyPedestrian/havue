import DefaultTheme from 'vitepress/theme'
import { getWindow, getDocument, extend } from 'ssr-window'
import Layout from './Layout.vue'

const window = getWindow()
const document = getDocument()
extend(window, {
  navigator: {
    userAgent: ''
  }
})

extend(document, {
  body: {
    addEventListener: () => {},
    removeEventListener: () => {}
  }
})

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
    if (import.meta.env.SSR) {
      globalThis.window = window
      globalThis.navigator = window.navigator
      globalThis.document = document
    }
  },
  extends: DefaultTheme
}
