import { getPinyinInitial } from './getPinyinInitial'

/**
 * 字符排序函数
 *
 * 数字优先级最高，按照从小到大排序
 *
 * 英文和汉字按照26个字母顺序排序，同字母顺序，英文优先级比汉字高
 *
 * 特殊符号优先级最低
 *
 * <!-- 有特殊符号则忽略，直接从特殊符号后面那个字符开始排序 -->
 *
 * 例子：1abc>3abc>aabc>阿abc>babc>菜菜菜菜111>！2abc
 * @param {string} a
 * @param {string} b
 * @returns number a应该在b之前返回负数， a应在b之后返回正数，相同则返回0
 */
export function stringSortFn(a: string, b: string, ignoreSpecialChar: boolean = false): number {
  a = a || ''
  b = b || ''
  if (ignoreSpecialChar) {
    // 去除特殊字符
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

  // 特殊字符
  const isSpecialCharA = /[^\u4e00-\u9fa5a-zA-Z0-9]/.test(a1)
  const isSpecialCharB = /[^\u4e00-\u9fa5a-zA-Z0-9]/.test(b1)

  if (isSpecialCharA && !isSpecialCharB) return 1
  if (!isSpecialCharA && isSpecialCharB) return -1

  if (isSpecialCharA && isSpecialCharB) {
    return stringSortFn(a.slice(1), b.slice(1), ignoreSpecialChar)
  }

  // 判断第一个字符是否为数字
  const isNumberA = /^[0-9]/.test(a1)
  const isNumberB = /^[0-9]/.test(b1)

  // 如果 a 是数字而 b 不是，则 a 应该排在前面
  if (isNumberA && !isNumberB) return -1
  // 如果 b 是数字而 a 不是，则 b 应该排在前面
  if (!isNumberA && isNumberB) return 1

  // 都是数字 比较大小
  if (isNumberA && isNumberB) {
    const numA = Number(a1)
    const numB = Number(b1)
    if (numA === numB) {
      return stringSortFn(a.slice(1), b.slice(1), ignoreSpecialChar)
    }
    return numA - numB
  }

  // 判断第一个字符是否为英文
  const isEnglishA = /^[a-zA-Z]/.test(a1)
  const isEnglishB = /^[a-zA-Z]/.test(b1)

  // 如果 a 是英文而 b 不是，则 a 应该排在前面
  if (isEnglishA && !isEnglishB) {
    return new Intl.Collator('zh-Hans', { caseFirst: 'lower' }).compare(a1, getPinyinInitial(b1))
  }

  // 如果 b 是英文而 a 不是，则 b 应该排在前面
  if (!isEnglishA && isEnglishB) {
    return new Intl.Collator('zh-Hans', { caseFirst: 'lower' }).compare(getPinyinInitial(a1), b1)
  }

  const compareRes = new Intl.Collator('zh-Hans', { caseFirst: 'lower' }).compare(a1, b1)

  if (compareRes !== 0) return compareRes

  return stringSortFn(a.slice(1), b.slice(1), ignoreSpecialChar)
}
