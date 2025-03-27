import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { getAlias } from '@havue/build'

const aliasList = getAlias()

const guideItems = [
  {
    text: '指南',
    items: [
      { text: '介绍', link: '/guide/' },
      { text: '快速开始', link: '/guide/quickstart' }
    ]
  }
]

const componentsItems = [
  {
    text: '组件',
    items: [
      { text: '开始', link: '/components/' },
      { text: '颜色选择器', link: '/components/color-picker' },
      { text: '拖动缩放', link: '/components/drag-and-scale' },
      { text: '拖拽', link: '/components/drag-and-drop' }
    ]
  }
]

const solutionsItems = [
  {
    text: '解决方案',
    items: [
      { text: '开始', link: '/solutions/' },
      { text: '全屏页面适配', link: '/solutions/full-screen-adapt' },
      { text: '移动端手势识别', link: '/solutions/gesture-2-mouse' },
      { text: 'BroadcastChannel广播消息', link: '/solutions/broadcast-channel-connect' },
      { text: 'WebSocket视频播放器', link: '/solutions/use-ws-video' }
    ]
  }
]

const directivesItems = [
  {
    text: '自定义指令',
    items: [
      { text: '开始', link: '/directives/' },
      {
        text: '右键点击事件',
        link: '/directives/right-click'
      }
    ]
  }
]

const toolsItems = [
  {
    text: '工具函数',
    items: [
      { text: '开始', link: '/tools/' },
      {
        text: '字符串',
        link: '/tools/string'
      }
    ]
  }
]

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
      { text: '指南', link: '/guide/', activeMatch: '/guide/' },
      { text: '组件', link: '/components/', activeMatch: '/components/' },
      { text: '指令', link: '/directives/', activeMatch: '/directives/' },
      { text: '解决方案', link: '/solutions/', activeMatch: '/solutions/' },
      { text: '工具函数', link: '/tools/', activeMatch: '/tools/' }
    ],

    sidebar: {
      '/guide/': guideItems,
      '/components/': componentsItems,
      '/solutions/': solutionsItems,
      '/directives': directivesItems,
      '/tools': toolsItems
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^@\/(.*)/,
          replacement: resolve(__dirname, '..', '..', 'demos', '$1')
        },
        ...aliasList
      ]
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
