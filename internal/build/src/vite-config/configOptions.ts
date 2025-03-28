import type { UserConfig, LibraryFormats } from 'vite'
import type { PackageJson } from 'type-fest'
import { readJsonFile } from '@havue/build-utils'
import type { ModeType } from '../types'
import { getExternal } from './external'
import { getPlugins } from './plugins'
import { getAlias } from './alias'
import { kebabCase } from '../utils'

import { absCwd, outDir, entryPath } from '@havue/build-utils'

const aliasList = getAlias()

export async function getViteConfig(mode: ModeType = 'package'): Promise<UserConfig> {
  const packageJson = await readJsonFile<PackageJson>(absCwd('package.json'))
  const external = getExternal(packageJson, mode)
  const finalName = kebabCase(packageJson.name || 'index')
  const plugins = await getPlugins()

  const formats: LibraryFormats[] = mode === 'package' ? ['es', 'umd'] : ['umd']

  return {
    resolve: {
      alias: [...aliasList]
    },
    plugins,
    build: {
      minify: mode === 'full-min' ? 'esbuild' : false,
      sourcemap: mode === 'full-min',
      emptyOutDir: mode === 'package',
      outDir,
      lib: {
        entry: entryPath,
        formats: formats,
        name: finalName,
        fileName: (formats) => getOutFileName(finalName, formats as LibraryFormats, mode)
      },
      cssCodeSplit: false,
      rollupOptions: {
        external,
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    }
  }
}

export function getOutFileName(fileName: string, format: LibraryFormats, mode: ModeType) {
  const formatName = format
  const ext = formatName === 'es' ? '.mjs' : '.umd.js'
  let tail: string
  // 全量构建时，文件名后缀的区别
  if (mode === 'full') {
    tail = '.full.js'
  } else if (mode === 'full-min') {
    tail = '.full.min.js'
  } else {
    tail = ext
  }
  return `${fileName}${tail}`
}
