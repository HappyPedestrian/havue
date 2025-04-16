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
    }
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
