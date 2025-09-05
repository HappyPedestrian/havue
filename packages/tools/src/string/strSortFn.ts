import { getPinyinInitial } from './getPinyinInitial'

/**
 * 字符排序函数 | Character sorting functions
 *
 * 数字优先级最高，按照从小到大排序 | Numbers have the highest priority and are ordered from smallest to largest
 *
 * 英文和汉字按照26个字母顺序排序，同字母顺序，英文优先级比汉字高 | English and Chinese characters are sorted in 26 alphabetical order, with English having higher priority than Chinese characters
 *
 * 特殊符号优先级最低 | Special symbols have the lowest priority
 *
 * <!-- 有特殊符号则忽略，直接从特殊符号后面那个字符开始排序 | Special symbols are ignored and sorted starting from the character after the special symbol -->
 *
 * example：1abc>3abc>aabc>阿abc>babc>菜菜菜菜111>！2abc
 * @param {string} a
 * @param {string} b
 * @returns {number} a应该在b之前返回负数， a应在b之后返回正数，相同则返回0 | a should return a negative number before b, a should return a positive number after b, or 0 if it is the same
 */
export function stringSortFn(a: string, b: string, ignoreSpecialChar: boolean = false): number {
  a = a || ''
  b = b || ''
  if (ignoreSpecialChar) {
    // 去除特殊字符 | Remove special characters
    a = a.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
    b = b.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
  }

  const lenA = a.length
  const lenB = b.length

  if (!lenA || !lenB) {
    return !lenA && !lenB ? 0 : !lenA ? -1 : 1
  }

  const a1 = a[0]
  const b1 = b[0]

  // 特殊字符 | Special characters
  const isSpecialCharA = /[^\u4e00-\u9fa5a-zA-Z0-9]/.test(a1)
  const isSpecialCharB = /[^\u4e00-\u9fa5a-zA-Z0-9]/.test(b1)

  if (isSpecialCharA && !isSpecialCharB) return 1
  if (!isSpecialCharA && isSpecialCharB) return -1

  if (isSpecialCharA && isSpecialCharB) {
    return stringSortFn(a.slice(1), b.slice(1), ignoreSpecialChar)
  }

  // 判断第一个字符是否为数字 | Determines whether the first character is a number
  const isNumberA = /^[0-9]/.test(a1)
  const isNumberB = /^[0-9]/.test(b1)

  // 如果 a 是数字而 b 不是，则 a 应该排在前面
  // If a is a number and b is not, a should come first
  if (isNumberA && !isNumberB) return -1
  // 如果 b 是数字而 a 不是，则 b 应该排在前面
  // If b is a number and a is not, b should come first
  if (!isNumberA && isNumberB) return 1

  // 都是数字 比较大小 | It's all numbers. Compare the size
  if (isNumberA && isNumberB) {
    const numA = Number(a1)
    const numB = Number(b1)
    if (numA === numB) {
      return stringSortFn(a.slice(1), b.slice(1), ignoreSpecialChar)
    }
    return numA - numB
  }

  // 判断第一个字符是否为英文
  // Determines if the first character is in English
  const isEnglishA = /^[a-zA-Z]/.test(a1)
  const isEnglishB = /^[a-zA-Z]/.test(b1)

  // 如果 a 是英文而 b 不是，则 a 应该排在前面
  // If a is English and b is not, a should come first
  if (isEnglishA && !isEnglishB) {
    const res = new Intl.Collator('zh-Hans', { caseFirst: 'lower' }).compare(a1, getPinyinInitial(b1))
    return res === 0 ? -1 : res
  }

  // 如果 b 是英文而 a 不是，则 b 应该排在前面
  // If b is English and a is not, b should come first
  if (!isEnglishA && isEnglishB) {
    const res = new Intl.Collator('zh-Hans', { caseFirst: 'lower' }).compare(getPinyinInitial(a1), b1)
    return res === 0 ? 1 : res
  }

  const compareRes = new Intl.Collator('zh-Hans', { caseFirst: 'lower' }).compare(a1, b1)

  if (compareRes !== 0) return compareRes

  return stringSortFn(a.slice(1), b.slice(1), ignoreSpecialChar)
}
