import type { ModeType } from '../types'
import type { PackageJson } from 'type-fest'
import { PluginOption } from 'vite'
import {
  entryPath,
  outDir,
  outTypeDir,
  normalizePath,
  absCwd,
  relCwd,
  writeJsonFile,
  readJsonFile
} from '@havue/build-utils'
import { isObjectLike, kebabCase } from '../utils'
import { getOutFileName } from '../utils/name'

/**
 * 自定义插件，实现对 package.json 内容的修改与回写。
 * Custom plugins to modify and write back the content of package.json.
 * @param mode 构建类型
 */
export async function pluginSetPackageJson(mode: ModeType = 'package'): Promise<PluginOption> {
  const packageJson = await readJsonFile<PackageJson>(absCwd('package.json'))
  if (mode !== 'package') {
    return null
  }

  const finalName = kebabCase(packageJson.name?.split('/').pop() || '')

  return {
    name: 'set-package-json',
    // 只在构建模式下执行 | Only executed in build mode
    apply: 'build',
    async closeBundle() {
      const packageJsonObj = packageJson || {}

      // 将 types、main、module、exports 产物路径写入 package.json
      // Write the types、main、module、exports configuration path to package.json
      const exportsData: Record<string, any> = {}

      // 获取并设置 cjs 产物的路径 | Gets and sets the path to the cjs artifacts
      const absCjsPath = absCwd(outDir, getOutFileName(finalName, 'cjs', mode))
      const cjs = normalizePath(relCwd(absCjsPath))
      packageJsonObj.main = cjs
      exportsData.require = cjs

      // 获取并设置 es 产物的路径 | Gets and sets the path of the es product
      const esAbsPath = absCwd(outDir, getOutFileName(finalName, 'es', mode))
      const es = normalizePath(relCwd(esAbsPath))
      packageJsonObj.module = es
      exportsData.import = es

      // 获取并设置 d.ts 产物的路径 | Gets and sets the path to the d.ts product
      const dtsEntry = normalizePath(getDtsPath())
      packageJsonObj.types = dtsEntry
      exportsData.types = dtsEntry

      if (!isObjectLike(packageJsonObj.exports)) {
        packageJsonObj.exports = {}
      }
      Object.assign(packageJsonObj.exports, { '.': exportsData })

      // 回写入 package.json 文件 | Write back to package.json
      await writeJsonFile(absCwd('package.json'), packageJsonObj, null, 2)
    }
  }
}

/**
 * 根据源码入口和产物目录，计算出 d.ts 类型声明的入口的相对地址
 * Calculate the relative address of the entry point for the d.ts type declaration from the source entry point and the product directory
 */
function getDtsPath() {
  return relCwd(absCwd(outTypeDir, entryPath.replace(/\.[^.]*$/, '.d.ts') || 'index.d.ts'))
}
