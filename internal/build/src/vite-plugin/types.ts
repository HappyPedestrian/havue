import { PluginOption } from 'vite'
import { cp } from 'node:fs/promises'
import { pkgRoot, souceTypeRoot, outTypeDir, absCwd } from '@havue/build-utils'

/** 自定义插件，将 ts类型定义移动到子包目录 */
export function pluginTypeDefine(): PluginOption {
  const cwd = absCwd()
  const sourceRoot = cwd.replace(pkgRoot, souceTypeRoot)
  const targetRoot = absCwd(outTypeDir)

  return {
    name: 'move-dts',
    apply: 'build',
    async closeBundle() {
      try {
        // 移动产物
        await cp(sourceRoot, targetRoot, {
          force: true,
          recursive: true
        })
      } catch (err) {
        console.log(`[${cwd}]: failed to move dts!`)

        console.error(err)
      }
    }
  }
}
