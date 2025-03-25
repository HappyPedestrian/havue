// import { defineConfig } from 'vite'

// // https://vitejs.dev/config/
// export default defineConfig({
//   build: {
//     lib: {
//       entry: './src/index.ts',
//       formats: ['es', 'cjs'],
//       fileName: 'index'
//     },
//     minify: false,
//     rollupOptions: {
//       external: [
//         // 除了 @pedy/shared，未来可能还会依赖其他内部模块，不如用正则表达式将 @pedy 开头的依赖项一起处理掉
//         '@vitejs/plugin-vue',
//         /@pedy.*/,
//         'vue'
//       ]
//     }
//   }
// })
