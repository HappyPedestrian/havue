# Fullscreen Page Adaptation

To install all solutions, please refer to [Solutions Installation](./index.md)

## Applicable Scenarios

The page size matches the screen's viewport, and the project page needs to be fully displayed on the screen while maintaining the UI design's dimensions and proportions.

## Solution

Use `postcss-pxtorem` to convert page units to rem (relative to the root element's font size). Then calculate an appropriate scaling ratio based on the UI design dimensions and the screen size to ensure the page is fully displayed while preserving the design proportions.

:::tip
Note: Areas requiring adaptive layout within the page need manual style adjustments.
:::

## Install This Hook Separately

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

## Steps

### Install postcss-pxtorem

```bash
npm install -D postcss-pxtorem
```

### Configure Environment Variables

Edit `.env` file:

```env
# UI design width
VITE_UI_DESIGN_WIDTH = 1280

# UI design height
VITE_UI_DESIGN_HEIGHT = 740

# postcss-pxtorem rootValue
VITE_PXTOREM_ROOTVALUE = 100
```

### Configure postcss-pxtorem

Edit  `.postcssrc.cjs

```js
// PostCSS plugins
const autoPrefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const vite = require('vite')
module.exports = ({ env }) => {
  const envObj = vite.loadEnv(env, './')
  return {
    plugins: [
      autoPrefixer(),
      pxtorem({
        rootValue: Number(envObj.VITE_PXTOREM_ROOTVALUE) || 16, // Root element font size
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

### Implement Dynamic Root Font Size Adjustment

::: code-group

```ts  [insall]
import { useFullScreenAdapt } from 'havue'
// or
import { useFullScreenAdapt } from '@havue/hooks'
// or
import { useFullScreenAdapt } from '@havue/use-full-screen-adapt'
```

<<< ../../../packages/hooks/use-full-screen-adapt/src/index.ts [Manual Code]

:::

Skip this step if already installed.

### Use in Entry File (main.ts)

```ts
  useFullScreenAdapt(Number(import.meta.env.VITE_UI_DESIGN_WIDTH), Number(import.meta.env.VITE_UI_DESIGN_HEIGHT), Number(import.meta.env.VITE_PXTOREM_ROOTVALUE) || 16)
```
