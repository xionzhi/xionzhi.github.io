// .vitepress/theme/index.js
import PostLayout from './PostLayout.vue'
import DefaultTheme from 'vitepress/theme'

// import './custom.css'
// import { h } from 'vue'

export default {
  ...DefaultTheme,
  Layout: PostLayout,
      
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`.
    // router is VitePress' custom router. `siteData` is
    // a `ref` of current site-level metadata.
  },

}
