import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  extends: DefaultTheme
}
