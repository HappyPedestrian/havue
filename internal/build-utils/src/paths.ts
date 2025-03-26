import { resolve, relative, sep, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const projRoot = resolve(__dirname, '..', '..', '..')
export const pkgRoot = resolve(projRoot, 'packages')
export const compRoot = resolve(pkgRoot, 'components')
export const pdRoot = resolve(pkgRoot, 'pedy')
export const directiveRoot = resolve(pkgRoot, 'directives')
export const hookRoot = resolve(pkgRoot, 'hooks')

/** vut-tsc生成的类型文件目录 */
export const souceTypeRoot = resolve(projRoot, 'dist/packages')

export const entryPath = './src/index.ts'
/** 打包后文件存放在各自包的目录 */
export const outDir = 'dist'

/** 打包后类型文件存放在各自包的目录 */
export const outTypeDir = 'dist/types'

export const getDistRoot = (base: string) => {
  return resolve(base, outDir)
}

export const getTypeRoot = (base: string) => {
  return resolve(base, outTypeDir)
}

/** 抹平 Win 与 Linux 系统路径分隔符之间的差异 */
export function normalizePath(path: string) {
  if (sep !== '/') {
    path = path.replace(new RegExp(`\\${sep}`, 'g'), '/')
  }

  return path.slice(0, 2) === '..' ? path : `./${path}`
}

/** 获取相对于当前脚本执行位置的绝对路径 */
export function absCwd(...paths: string[]) {
  return resolve(process.cwd(), ...paths)
}

/** 获取相对于当前脚本执行位置的绝对路径 */
export function relCwd(path: string) {
  return relative(process.cwd(), path)
}
