import type { LibraryFormats } from 'vite'
import type { ModeType } from '../types'

/**
 * 获取产物文件名称 | Gets the product file name
 * @param fileName 文件名称 | File name
 * @param format 产物格式 | format
 * @param buildMode 构建模式 | Build mode
 */
export function getOutFileName(fileName: string, format: LibraryFormats, mode: ModeType) {
  const formatName = format
  const ext = formatName === 'es' ? '.mjs' : '.umd.js'
  let tail: string
  // 全量构建时，文件名后缀的区别 | Filename suffix for full builds
  if (mode === 'full') {
    tail = '.full.js'
  } else if (mode === 'full-min') {
    tail = '.full.min.js'
  } else {
    tail = ext
  }
  return `${fileName}${tail}`
}
