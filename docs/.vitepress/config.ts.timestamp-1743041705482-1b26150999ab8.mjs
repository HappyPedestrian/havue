// .vitepress/config.ts
import { defineConfig } from "file:///E:/study/VueComponents/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.21.0_@types+node@22.13.10_async-validator@4.2.5_post_jz7nn3sl4ezo7jucc6c4ohetny/node_modules/vitepress/dist/node/index.js";
import { resolve } from "node:path";
import AutoImport from "file:///E:/study/VueComponents/node_modules/.pnpm/unplugin-auto-import@0.18.6_@vueuse+core@11.3.0_vue@3.5.13_typescript@5.8.2___rollup@4.36.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/study/VueComponents/node_modules/.pnpm/unplugin-vue-components@0.27.5_@babel+parser@7.27.0_rollup@4.36.0_vue@3.5.13_typescript@5.8.2_/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///E:/study/VueComponents/node_modules/.pnpm/unplugin-vue-components@0.27.5_@babel+parser@7.27.0_rollup@4.36.0_vue@3.5.13_typescript@5.8.2_/node_modules/unplugin-vue-components/dist/resolvers.js";
import { getAlias } from "file:///E:/study/VueComponents/internal/build/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\study\\VueComponents\\docs\\.vitepress";
var aliasList = getAlias();
var config_default = defineConfig({
  title: "My Awesome Components",
  description: "A Components list site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local"
    },
    nav: [
      { text: "\u6307\u5357", link: "/guide/" },
      { text: "\u7EC4\u4EF6", link: "/components/" },
      { text: "\u6307\u4EE4", link: "/directives/" },
      { text: "\u89E3\u51B3\u65B9\u6848", link: "/solutions/" },
      { text: "\u5DE5\u5177\u51FD\u6570", link: "/tools/" }
    ],
    sidebar: {
      "/guide/": [
        {
          text: "\u6307\u5357",
          items: [
            { text: "\u4ECB\u7ECD", link: "/guide/" },
            { text: "\u5FEB\u901F\u5F00\u59CB", link: "/guide/quickstart" }
          ]
        }
      ],
      "/components/": [
        {
          text: "\u7EC4\u4EF6",
          items: [
            { text: "\u5F00\u59CB", link: "/components/" },
            { text: "\u989C\u8272\u9009\u62E9\u5668", link: "/components/color-picker" },
            { text: "\u62D6\u52A8\u7F29\u653E", link: "/components/drag-and-scale" },
            { text: "\u62D6\u62FD", link: "/components/drag-and-drop" }
          ]
        }
      ],
      "/solutions/": [
        {
          text: "\u89E3\u51B3\u65B9\u6848",
          items: [
            { text: "\u5F00\u59CB", link: "/solutions/" },
            { text: "\u5168\u5C4F\u9875\u9762\u9002\u914D", link: "/solutions/full-screen-adapt" },
            { text: "\u79FB\u52A8\u7AEF\u624B\u52BF\u8BC6\u522B", link: "/solutions/gesture-2-mouse" },
            { text: "BroadcastChannel\u5E7F\u64AD\u6D88\u606F", link: "/solutions/broadcast-channel-connect" },
            { text: "WebSocket\u89C6\u9891\u64AD\u653E\u5668", link: "/solutions/use-ws-video" }
          ]
        }
      ],
      "/directives": [
        {
          text: "\u81EA\u5B9A\u4E49\u6307\u4EE4",
          items: [
            { text: "\u5F00\u59CB", link: "/directives/" },
            {
              text: "\u53F3\u952E\u70B9\u51FB\u4E8B\u4EF6",
              link: "/directives/right-click"
            }
          ]
        }
      ],
      "/tools": [
        {
          text: "\u5DE5\u5177\u51FD\u6570",
          items: [
            { text: "\u5F00\u59CB", link: "/tools/" },
            {
              text: "\u5B57\u7B26\u4E32",
              link: "/tools/string"
            }
          ]
        }
      ]
    },
    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }]
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^@\/(.*)/,
          replacement: resolve(__vite_injected_original_dirname, "..", "..", "demos", "$1")
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
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxzdHVkeVxcXFxWdWVDb21wb25lbnRzXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcc3R1ZHlcXFxcVnVlQ29tcG9uZW50c1xcXFxkb2NzXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9zdHVkeS9WdWVDb21wb25lbnRzL2RvY3MvLnZpdGVwcmVzcy9jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlcHJlc3MnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IHsgZ2V0QWxpYXMgfSBmcm9tICdAaGF2dWUvYnVpbGQnXG5cbmNvbnN0IGFsaWFzTGlzdCA9IGdldEFsaWFzKClcblxuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgdGl0bGU6ICdNeSBBd2Vzb21lIENvbXBvbmVudHMnLFxuICBkZXNjcmlwdGlvbjogJ0EgQ29tcG9uZW50cyBsaXN0IHNpdGUnLFxuICB0aGVtZUNvbmZpZzoge1xuICAgIC8vIGh0dHBzOi8vdml0ZXByZXNzLmRldi9yZWZlcmVuY2UvZGVmYXVsdC10aGVtZS1jb25maWdcbiAgICBzZWFyY2g6IHtcbiAgICAgIHByb3ZpZGVyOiAnbG9jYWwnXG4gICAgfSxcbiAgICBuYXY6IFtcbiAgICAgIHsgdGV4dDogJ1x1NjMwN1x1NTM1NycsIGxpbms6ICcvZ3VpZGUvJyB9LFxuICAgICAgeyB0ZXh0OiAnXHU3RUM0XHU0RUY2JywgbGluazogJy9jb21wb25lbnRzLycgfSxcbiAgICAgIHsgdGV4dDogJ1x1NjMwN1x1NEVFNCcsIGxpbms6ICcvZGlyZWN0aXZlcy8nIH0sXG4gICAgICB7IHRleHQ6ICdcdTg5RTNcdTUxQjNcdTY1QjlcdTY4NDgnLCBsaW5rOiAnL3NvbHV0aW9ucy8nIH0sXG4gICAgICB7IHRleHQ6ICdcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzAnLCBsaW5rOiAnL3Rvb2xzLycgfVxuICAgIF0sXG5cbiAgICBzaWRlYmFyOiB7XG4gICAgICAnL2d1aWRlLyc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdcdTYzMDdcdTUzNTcnLFxuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTRFQ0JcdTdFQ0QnLCBsaW5rOiAnL2d1aWRlLycgfSxcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQicsIGxpbms6ICcvZ3VpZGUvcXVpY2tzdGFydCcgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgICcvY29tcG9uZW50cy8nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnXHU3RUM0XHU0RUY2JyxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgeyB0ZXh0OiAnXHU1RjAwXHU1OUNCJywgbGluazogJy9jb21wb25lbnRzLycgfSxcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1OTg5Q1x1ODI3Mlx1OTAwOVx1NjJFOVx1NTY2OCcsIGxpbms6ICcvY29tcG9uZW50cy9jb2xvci1waWNrZXInIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTYyRDZcdTUyQThcdTdGMjlcdTY1M0UnLCBsaW5rOiAnL2NvbXBvbmVudHMvZHJhZy1hbmQtc2NhbGUnIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTYyRDZcdTYyRkQnLCBsaW5rOiAnL2NvbXBvbmVudHMvZHJhZy1hbmQtZHJvcCcgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgICcvc29sdXRpb25zLyc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdcdTg5RTNcdTUxQjNcdTY1QjlcdTY4NDgnLFxuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTVGMDBcdTU5Q0InLCBsaW5rOiAnL3NvbHV0aW9ucy8nIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTUxNjhcdTVDNEZcdTk4NzVcdTk3NjJcdTkwMDJcdTkxNEQnLCBsaW5rOiAnL3NvbHV0aW9ucy9mdWxsLXNjcmVlbi1hZGFwdCcgfSxcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NzlGQlx1NTJBOFx1N0FFRlx1NjI0Qlx1NTJCRlx1OEJDNlx1NTIyQicsIGxpbms6ICcvc29sdXRpb25zL2dlc3R1cmUtMi1tb3VzZScgfSxcbiAgICAgICAgICAgIHsgdGV4dDogJ0Jyb2FkY2FzdENoYW5uZWxcdTVFN0ZcdTY0QURcdTZEODhcdTYwNkYnLCBsaW5rOiAnL3NvbHV0aW9ucy9icm9hZGNhc3QtY2hhbm5lbC1jb25uZWN0JyB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnV2ViU29ja2V0XHU4OUM2XHU5ODkxXHU2NEFEXHU2NTNFXHU1NjY4JywgbGluazogJy9zb2x1dGlvbnMvdXNlLXdzLXZpZGVvJyB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgJy9kaXJlY3RpdmVzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ1x1ODFFQVx1NUI5QVx1NEU0OVx1NjMwN1x1NEVFNCcsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NUYwMFx1NTlDQicsIGxpbms6ICcvZGlyZWN0aXZlcy8nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6ICdcdTUzRjNcdTk1MkVcdTcwQjlcdTUxRkJcdTRFOEJcdTRFRjYnLFxuICAgICAgICAgICAgICBsaW5rOiAnL2RpcmVjdGl2ZXMvcmlnaHQtY2xpY2snXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgJy90b29scyc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzAnLFxuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTVGMDBcdTU5Q0InLCBsaW5rOiAnL3Rvb2xzLycgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGV4dDogJ1x1NUI1N1x1N0IyNlx1NEUzMicsXG4gICAgICAgICAgICAgIGxpbms6ICcvdG9vbHMvc3RyaW5nJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG5cbiAgICBzb2NpYWxMaW5rczogW3sgaWNvbjogJ2dpdGh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdml0ZXByZXNzJyB9XVxuICB9LFxuICB2aXRlOiB7XG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6IC9eQFxcLyguKikvLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiByZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJ2RlbW9zJywgJyQxJylcbiAgICAgICAgfSxcbiAgICAgICAgLi4uYWxpYXNMaXN0XG4gICAgICBdXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICBBdXRvSW1wb3J0KHtcbiAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXVxuICAgICAgfSksXG4gICAgICBDb21wb25lbnRzKHtcbiAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXVxuICAgICAgfSlcbiAgICBdXG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9TLFNBQVMsb0JBQW9CO0FBQ2pVLFNBQVMsZUFBZTtBQUN4QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUNwQyxTQUFTLGdCQUFnQjtBQUx6QixJQUFNLG1DQUFtQztBQU96QyxJQUFNLFlBQVksU0FBUztBQUczQixJQUFPLGlCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsRUFDUCxhQUFhO0FBQUEsRUFDYixhQUFhO0FBQUE7QUFBQSxJQUVYLFFBQVE7QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxFQUFFLE1BQU0sZ0JBQU0sTUFBTSxVQUFVO0FBQUEsTUFDOUIsRUFBRSxNQUFNLGdCQUFNLE1BQU0sZUFBZTtBQUFBLE1BQ25DLEVBQUUsTUFBTSxnQkFBTSxNQUFNLGVBQWU7QUFBQSxNQUNuQyxFQUFFLE1BQU0sNEJBQVEsTUFBTSxjQUFjO0FBQUEsTUFDcEMsRUFBRSxNQUFNLDRCQUFRLE1BQU0sVUFBVTtBQUFBLElBQ2xDO0FBQUEsSUFFQSxTQUFTO0FBQUEsTUFDUCxXQUFXO0FBQUEsUUFDVDtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sT0FBTztBQUFBLFlBQ0wsRUFBRSxNQUFNLGdCQUFNLE1BQU0sVUFBVTtBQUFBLFlBQzlCLEVBQUUsTUFBTSw0QkFBUSxNQUFNLG9CQUFvQjtBQUFBLFVBQzVDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGdCQUFnQjtBQUFBLFFBQ2Q7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE9BQU87QUFBQSxZQUNMLEVBQUUsTUFBTSxnQkFBTSxNQUFNLGVBQWU7QUFBQSxZQUNuQyxFQUFFLE1BQU0sa0NBQVMsTUFBTSwyQkFBMkI7QUFBQSxZQUNsRCxFQUFFLE1BQU0sNEJBQVEsTUFBTSw2QkFBNkI7QUFBQSxZQUNuRCxFQUFFLE1BQU0sZ0JBQU0sTUFBTSw0QkFBNEI7QUFBQSxVQUNsRDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYjtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sT0FBTztBQUFBLFlBQ0wsRUFBRSxNQUFNLGdCQUFNLE1BQU0sY0FBYztBQUFBLFlBQ2xDLEVBQUUsTUFBTSx3Q0FBVSxNQUFNLCtCQUErQjtBQUFBLFlBQ3ZELEVBQUUsTUFBTSw4Q0FBVyxNQUFNLDZCQUE2QjtBQUFBLFlBQ3RELEVBQUUsTUFBTSw0Q0FBd0IsTUFBTSx1Q0FBdUM7QUFBQSxZQUM3RSxFQUFFLE1BQU0sMkNBQWtCLE1BQU0sMEJBQTBCO0FBQUEsVUFDNUQ7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsZUFBZTtBQUFBLFFBQ2I7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE9BQU87QUFBQSxZQUNMLEVBQUUsTUFBTSxnQkFBTSxNQUFNLGVBQWU7QUFBQSxZQUNuQztBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBLFlBQ1I7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixPQUFPO0FBQUEsWUFDTCxFQUFFLE1BQU0sZ0JBQU0sTUFBTSxVQUFVO0FBQUEsWUFDOUI7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxZQUNSO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsYUFBYSxDQUFDLEVBQUUsTUFBTSxVQUFVLE1BQU0scUNBQXFDLENBQUM7QUFBQSxFQUM5RTtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLGFBQWEsUUFBUSxrQ0FBVyxNQUFNLE1BQU0sU0FBUyxJQUFJO0FBQUEsUUFDM0Q7QUFBQSxRQUNBLEdBQUc7QUFBQSxNQUNMO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsV0FBVztBQUFBLFFBQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsTUFDbkMsQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsTUFDbkMsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
