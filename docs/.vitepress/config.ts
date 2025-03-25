import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { getAlias } from '../../packages/build/src/vite-config/alias'

const aliasList = getAlias()

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
      { text: '解决方案', link: '/solutions/' },
      { text: '指令', link: '/directives/' },
      { text: '工具函数', link: '/tools/' }
    ],

    sidebar: {
      '/components/': [
        {
          text: '组件',
          items: [
            { text: '开始', link: '/components/' },
            { text: '颜色选择器', link: '/components/color-picker' },
            { text: '拖动缩放', link: '/components/drag-and-scale' },
            { text: '拖拽', link: '/components/drag-and-drop' }
          ]
        }
      ],
      '/solutions/': [
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
      ],
      '/directives': [
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
      ],
      '/tools': [
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
