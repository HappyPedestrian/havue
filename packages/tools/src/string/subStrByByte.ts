/** 获取文本byte长度 */
function getStrByteLength(str: string) {
  const encoder = new TextEncoder()
  const uint8Array = encoder.encode(str)
  return uint8Array.length
}
/**
 * 截取不超过规定byte长度的字符串 | Truncate a string up to the specified byte length
 * @param str 原始字符串 | Raw string
 * @param byteLen 限制的byte长度 | The byte size of the limit
 * @returns 限制不超过byteLen byte的字符串 | Limit strings up to byteLen byte
 */
export function subStrByByteLen(str: string, byteLen: number) {
  str = str || ''
  let len = 0

  let result = ''
  for (const char of str) {
    const charLen = getStrByteLength(char)
    if (len + charLen > byteLen) {
      break
    }
    result += char
    len += charLen
  }

  return result
}
