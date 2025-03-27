# 全屏页面适配

如需安装所有解决方案，请参考[安装](./index.md)

## 适用场景

页面大小为屏幕可视区域大小，项目页面需要完整的显示在屏幕中，且保持UI设计的尺寸比例。

## 方案

使用postcss-pxtorem, 将页面单位转换为rem，即与页面根元素字体大小相关，再根据UI设计尺寸和页面的尺寸，计算合适的一个比例，使得页面能够完整的显示在页面中，且保持页面的设计比例

:::tip
注意：页面部分区域需要自适应剩余区域的，需要自行调整样式。
:::

## 单独安装此hook

::: code-group

```shell [npm]
npm install @havue/use-full-screen-adapt --save
```

```shell [yarn]
yarn add @havue/use-full-screen-adapt
```

```shell [pnpm]
pnpm install @havue/use-full-screen-adapt
```

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

::: code-group

```ts  [安装]
import { useFullScreenAdapt } from 'havue'
// or
import { useFullScreenAdapt } from '@havue/hooks'
// or
import { useFullScreenAdapt } from '@havue/use-full-screen-adapt'
```

<<< ../../packages/hooks/use-full-screen-adapt/src/index.ts [手动编写]

:::

如果已通过安装，则不需要编写代码

### 在项目入口 main.ts 中使用

```ts
  useFullScreenAdapt(Number(import.meta.env.VITE_UI_DESIGN_WIDTH), Number(import.meta.env.VITE_UI_DESIGN_HEIGHT), Number(import.meta.env.VITE_PXTOREM_ROOTVALUE) || 16)
```
