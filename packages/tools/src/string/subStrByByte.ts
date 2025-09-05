/**
 * 截取不超过规定byte长度的字符串 | Truncate a string up to the specified byte length
 * @param str 原始字符串 | Raw string
 * @param byteLen 限制的byte长度 | The byte size of the limit
 * @returns 限制不超过byteLen byte的字符串 | Limit strings up to byteLen byte
 */
export function subStrByByteLen(str: string, byteLen: number) {
  str = str || ''
  const twoByteReg = /[\u0080-\uFFFF]/
  let len = 0
  let maxLenIndex = str.length
  const charList = str.split('')

  for (let i = 0; i < charList.length; i++) {
    const char = charList[i]
    const charLen = twoByteReg.test(char) ? 2 : 1
    if (len + charLen > byteLen) {
      maxLenIndex = i
      break
    }
    len += charLen
  }

  return str.substring(0, maxLenIndex)
}
