import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('../../../packages/havue/package.json')

export const en = defineConfig({
  lang: 'en-US',
  description: 'A Components and Utils library',
  themeConfig: {
    nav: nav(),
    sidebar: {
      '/': {
        base: '/',
        items: sidebarGuide()
      }
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容'
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Guide', link: '/guide/index', activeMatch: '/' },
    {
      text: pkg.version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/HappyPedestrian/havue/blob/main/CHANGELOG.md'
        }
      ]
    }
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guide',
      collapsed: false,
      items: [
        { text: 'Introduction', link: 'guide/' },
        { text: 'Getting Started', link: 'guide/quickstart' }
      ]
    },
    {
      text: 'Components',
      collapsed: false,
      items: [
        { text: 'Introduction', link: 'components/' },
        { text: 'Color Picker', link: 'components/color-picker' },
        { text: 'Drag And Drop', link: 'components/drag-and-drop' },
        { text: 'Drag And Scale', link: 'components/drag-and-scale' }
      ]
    },
    {
      text: 'Directives',
      collapsed: false,
      items: [
        { text: 'Introduction', link: 'directives/' },
        {
          text: 'Mouse Right Click',
          link: 'directives/right-click'
        }
      ]
    },
    {
      text: 'Solutions',
      collapsed: false,
      items: [
        { text: 'Introduction', link: 'solutions/' },
        { text: 'Full Screen Adapt', link: 'solutions/full-screen-adapt' },
        { text: 'Gesture to Mouse', link: 'solutions/gesture-2-mouse' },
        { text: 'BroadcastChannel Connect', link: 'solutions/broadcast-channel-connect' },
        { text: 'WebSocket Video Play', link: 'solutions/use-ws-video' }
      ]
    },
    {
      text: 'Tools',
      collapsed: false,
      base: '/tools/',
      items: [
        { text: 'Introduction', link: 'index' },
        {
          text: 'String',
          link: 'string'
        }
      ]
    }
  ]
}
