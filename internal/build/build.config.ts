import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      // 跳过 .d.ts 文件处理
      exclude: ['**/*.d.ts']
    }
  },
  failOnWarn: false
})
