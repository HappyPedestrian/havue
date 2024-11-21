/**
 * 获取中文拼音首字母
 * @param str 中文字符
 * @returns 大写首字母
 */
export function getPinyinInitial(str: string) {
  let idx = -1
  const enMap = 'ABCDEFGHJKLMNOPQRSTWXYZ'
  const boundaryChar = '驁簿錯鵽樲鰒餜靃攟鬠纙鞪黁漚曝裠鶸蜶籜鶩鑂韻糳'
  if (!String.prototype.localeCompare) {
    throw Error('String.prototype.localeCompare not supported.')
  }
  if (/[^\u4e00-\u9fa5]/.test(str)) {
    return str
  }
  for (let i = 0; i < boundaryChar.length; i++) {
    if (boundaryChar[i].localeCompare(str, 'zh-CN-u-co-pinyin') >= 0) {
      idx = i
      break
    }
  }
  return enMap[idx]
}
