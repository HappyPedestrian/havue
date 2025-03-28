import type { LibraryFormats } from 'vite'
import type { ModeType } from '../types'

/**
 * 获取产物文件名称
 * @param fileName 文件名称
 * @param format 产物格式
 * @param buildMode 构建模式
 */
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
