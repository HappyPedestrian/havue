import { ModeType } from '../types'

/**
 * 获取产物文件名称
 * @param fileName 文件名称
 * @param format 产物格式
 * @param buildMode 构建模式
 */
export function getOutFileName(fileName: string, format: 'es' | 'cjs', buildMode: ModeType) {
  const formatName = format as 'es' | 'cjs'
  const ext = formatName === 'es' ? '.mjs' : '.js'
  let tail: string
  // 全量构建时，文件名后缀的区别
  if (buildMode === 'full') {
    tail = '.full.js'
  } else if (buildMode === 'full-min') {
    tail = '.full.min.js'
  } else {
    tail = ext
  }
  return `${fileName}${tail}`
}
