import { resolve } from 'path'
import { normalizePath } from './resolvePath'

export const projRoot = normalizePath(resolve(__dirname, '..', '..', '..', '..'))
export const pkgRoot = normalizePath(resolve(projRoot, 'packages'))
export const compRoot = normalizePath(resolve(pkgRoot, 'components'))
export const pdRoot = normalizePath(resolve(pkgRoot, 'pedy'))
export const directiveRoot = normalizePath(resolve(pkgRoot, 'directives'))
export const hookRoot = normalizePath(resolve(pkgRoot, 'hooks'))

/** vut-tsc生成的类型文件目录 */
export const souceTypeRoot = normalizePath(resolve(projRoot, 'dist/packages'))

export const entryPath = './src/index.ts'
/** 打包后文件存放在各自包的目录 */
export const outDir = 'dist'

/** 打包后类型文件存放在各自包的目录 */
export const outTypeDir = 'dist/types'

export const getDistRoot = (base: string) => {
  return normalizePath(resolve(base, outDir))
}

export const getTypeRoot = (base: string) => {
  return normalizePath(resolve(base, outTypeDir))
}
