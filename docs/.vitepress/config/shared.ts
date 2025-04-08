import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { getAlias } from '@havue/build'
import { search as zhSearch } from './zh'

const aliasList = getAlias()

export const shared = defineConfig({
  base: '/havue/',
  title: 'Havue',
  rewrites: {
    'en/:rest*': ':rest*'
  },
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          ...zhSearch
        }
      }
    }
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^@\/(.*)/,
          replacement: resolve(__dirname, '..', '..', '..', 'demos', '$1')
        },
        ...aliasList
      ]
    },
    ssr: {
      noExternal: ['element-plus']
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
