# 全屏页面适配

## 适用场景

页面大小为屏幕可视区域大小，项目页面需要完整的显示在屏幕中，且保持UI设计的尺寸比例。

## 方案

使用postcss-pxtorem, 将页面单位转换为rem，即与页面根元素字体大小相关，再根据UI设计尺寸和页面的尺寸，计算合适的一个比例，使得页面能够完整的显示在页面中，且保持页面的设计比例

:::tip
注意：页面部分区域需要自适应剩余区域的，需要自行调整样式。
:::

## 步骤

### 安装postcss-pxtorem

```bash
npm install -D postcss-pxtorem
```

### 配置环境变量

编辑 .env 文件

```env
# ui 设计宽度
VITE_UI_DESIGN_WIDTH = 1280

# UI 设计高度
VITE_UI_DESIGN_HEIGHT = 740

# postcss-px-torem rootValue 值
VITE_PXTOREM_ROOTVALUE = 100
```

### 配置postcss-pxtorem

编辑 .postcssrc.cjs

```js
// postcss 插件
const autoPrefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const vite = require('vite')
module.exports = ({ env }) => {
  const envObj = vite.loadEnv(env, './')
  return {
    plugins: [
      autoPrefixer(),
      pxtorem({
        rootValue: Number(envObj.VITE_PXTOREM_ROOTVALUE) || 16, // 根元素字体大小
        unitPrecision: 5,
        propList: ['*'],
        replace: true,
        mediaQuery: true,
        minPixelValue: 1
      })
    ]
  }
}

```

### 编写动态更新根元素字体大小的代码

创建 useScreenAdapt.ts 文件

```ts
/**
 * 根据UI设计尺寸，以及当前屏幕尺寸，计算合适的根元素字体大小
 * @param uiWidth UI设计宽度
 * @param uiHeight UI设计高度
 * @param stopOnInput 在input聚焦时，停止计算根元素字体大小，固定页面尺寸
 */
export function useScreenAdapt(uiWidth: number, uiHeight: number, stopOnInput: boolean = false) {
  /** 打包后转换为rem单位的基准值 */
  const pxtoremRootValue = Number(import.meta.env.VITE_PXTOREM_ROOTVALUE) || 16
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

  /** 更改根元素字体大小 */
  function setRemUnit() {
    if (isStopAdapt) {
      return
    }
    /** UI 设计比例 */
    const uiRatio = uiWidth / uiHeight
    const { clientWidth, clientHeight } = docEl
    /** 屏幕宽高比例 */
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
 * 输入时，暂停根元素字体自适应计算
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
        const { width, height } = window.getComputedStyle(docEl)
        oldBodyWidth = width
        oldBodyHeight = height

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

```

### 在项目入口 main.ts 中使用

```ts
  useScreenAdapt(Number(import.meta.env.VITE_UI_DESIGN_WIDTH), Number(import.meta.env.VITE_UI_DESIGN_HEIGHT))
```
