/**
 * IP每一项值是否有效
 * @param val 单个IP值
 */
export function isValidIPItemValue(val: string | number) {
  const num = parseInt(val + '')
  return !isNaN(num) && num >= 0 && num <= 255
}

/**
 * 光标在输入框文本中的位置
 * @param { HTMLInputElement } el
 */
export function getRange(el: HTMLInputElement) {
  const ret: {
    begin: number | null
    end: number | null
    result: string | null
  } = {
    begin: null,
    end: null,
    result: null
  }
  ret.begin = el.selectionStart || 0
  ret.end = el.selectionEnd || 0
  ret.result = el.value.substring(ret.begin, ret.end)
  el.focus()
  return ret
}
