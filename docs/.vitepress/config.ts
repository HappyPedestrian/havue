import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Awesome Components',
  description: 'A Components list site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },
    nav: [
      { text: '组件', link: '/components/' },
      { text: '解决方案', link: '/solutions/' }
    ],

    sidebar: {
      '/components/': [
        {
          text: '组件',
          items: [
            { text: '开始', link: '/components/' },
            { text: '颜色选择器', link: '/components/color-picker' },
            { text: '拖动缩放', link: '/components/drag-and-scale' },
            { text: '拖拽', link: '/components/drag-and-drop' },
            { text: 'WebSocket视频播放器', link: '/components/websocket-fmp4-player' }
          ]
        }
      ],
      '/solutions/': [
        {
          text: '解决方案',
          items: [
            { text: '开始', link: '/solutions/' },
            { text: '全屏页面适配', link: '/solutions/full-screen-adapt' }
          ]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  },
  vite: {
    resolve: {
      alias: {
        '@': resolve('./src'),
        '#': resolve('./src/types')
      }
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  }
})
