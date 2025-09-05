/**
 * 根据UI设计尺寸，以及当前屏幕尺寸，计算合适的根元素字体大小 | Calculate the appropriate font size for the root element based on the UI design dimensions and the current screen size
 * @param uiWidth UI设计宽度 | UI design width
 * @param uiHeight UI设计高度 | UI design height
 * @param pxtoremRootValue postcss-pxtorem的rootValue值 | rootValue for postcss-pxtorem
 * @param stopOnInput 在input聚焦时，停止计算根元素字体大小，固定页面尺寸 | While inputting focus, stop calculating the root font size and fix the page size
 */
export function useFullScreenAdapt(
  uiWidth: number,
  uiHeight: number,
  pxtoremRootValue: number = 16,
  stopOnInput: boolean = false
) {
  const docEl = document.documentElement

  let isStopAdapt: boolean = false

  const stop = () => (isStopAdapt = true)
  const resume = () => (isStopAdapt = false)

  function setBodyFontSize() {
    if (document.body) {
      setRemUnit()
      if (stopOnInput) {
        stopAdaptOnInputFocused(stop, resume)
      }
    } else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize()

  /** 更改根元素字体大小 | Change the root font size */
  function setRemUnit() {
    if (isStopAdapt) {
      return
    }
    /** UI 设计比例 | UI Design aspect ratio */
    const uiRatio = uiWidth / uiHeight
    const { clientWidth, clientHeight } = docEl
    /** 屏幕宽高比例 | Screen aspect ratio */
    const screenRatio = clientWidth / clientHeight

    let targetWidth = clientWidth
    if (uiRatio > screenRatio) {
      const targetHeight = clientWidth / uiRatio
      targetWidth = targetHeight * uiRatio
    } else {
      targetWidth = uiRatio * clientHeight
    }
    const rem = (targetWidth * pxtoremRootValue) / uiWidth
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  return {
    stop,
    resume
  }
}

/**
 * 输入时，暂停根元素字体自适应计算 | When typing, pause the root element font adaptation calculation
 * @param onFocus
 * @param onBlur
 */
export function stopAdaptOnInputFocused(onFocus: (e?: FocusEvent) => void, onBlur: (e?: FocusEvent) => void) {
  const docEl = document.documentElement
  let oldBodyWidth: string
  let oldBodyHeight: string

  docEl.addEventListener(
    'focus',
    function (e) {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT') {
        onFocus()
        const { clientWidth, clientHeight } = docEl
        oldBodyWidth = docEl.style.width
        oldBodyHeight = docEl.style.height

        docEl.style.width = `${clientWidth}px`
        docEl.style.height = `${clientHeight}px`
      }
    },
    { capture: true }
  )
  docEl.addEventListener(
    'blur',
    function (e) {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT') {
        onBlur()
        docEl.style.width = oldBodyWidth
        docEl.style.height = oldBodyHeight
      }
    },
    { capture: true }
  )
}
