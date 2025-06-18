import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('../../../packages/havue/package.json')

export const zh = defineConfig({
  lang: 'zh-Hans',
  description: '包含组件以及一些js工具函数的库',
  themeConfig: {
    nav: nav(),
    sidebar: {
      '/zh/': {
        base: '/zh/',
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
    { text: '指南', link: '/zh/guide/', activeMatch: '/zh/' },
    {
      text: pkg.version,
      items: [
        {
          text: '更新日志',
          link: 'https://github.com/HappyPedestrian/havue/blob/main/CHANGELOG.md'
        }
      ]
    }
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '指南',
      collapsed: false,
      items: [
        { text: '介绍', link: 'guide/' },
        { text: '快速开始', link: 'guide/quickstart' }
      ]
    },
    {
      text: '组件',
      collapsed: false,
      items: [
        { text: '介绍', link: 'components/' },
        { text: '颜色选择器', link: 'components/color-picker' },
        { text: '拖拽', link: 'components/drag-and-drop' },
        { text: '拖动缩放', link: 'components/drag-and-scale' },
        { text: 'Ip 地址输入', link: 'components/ip-input' }
      ]
    },
    {
      text: '自定义指令',
      collapsed: false,
      items: [
        { text: '介绍', link: 'directives/' },
        {
          text: '右键点击事件',
          link: 'directives/right-click'
        }
      ]
    },
    {
      text: '解决方案',
      collapsed: false,
      items: [
        { text: '介绍', link: 'solutions/' },
        { text: '全屏页面适配', link: 'solutions/full-screen-adapt' },
        { text: '移动端手势识别', link: 'solutions/gesture-2-mouse' },
        { text: 'BroadcastChannel广播消息', link: 'solutions/broadcast-channel-connect' },
        { text: 'WebSocket视频播放器', link: 'solutions/use-ws-video' }
      ]
    },
    {
      text: '工具函数',
      collapsed: false,
      items: [
        { text: '介绍', link: 'tools/' },
        {
          text: '字符串',
          link: 'tools/string'
        }
      ]
    }
  ]
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  zh: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消'
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: '收藏',
          removeFavoriteSearchButtonTitle: '从收藏中移除'
        },
        errorScreen: {
          titleText: '无法获取结果',
          helpText: '你可能需要检查你的网络连接'
        },
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
          searchByText: '搜索提供者'
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: '你认为该查询应该有结果？',
          reportMissingResultsLinkText: '点击反馈'
        }
      }
    }
  }
}
