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

  const formats: LibraryFormats[] = ['umd']
  if (mode === 'package') {
    formats.push('es')
  }

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
        name: finalName
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
