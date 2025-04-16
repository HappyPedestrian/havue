# Color Picker

## Installation

::: info
If other components are needed, please refer to[Full Components Installation](./index.md)
:::

To install the Color Picker individually, run the following command:

::: code-group

```shell [npm]
npm install @havue/color-picker --save
```

```shell [yarn]
yarn add @havue/color-picker
```

```shell [pnpm]
pnpm install @havue/color-picker
```

:::

## Import

```vue
<script>
import { HvColorPicker } from 'havue'
// or 
import { HvColorPicker } from '@havue/components'
// or
import { HvColorPicker } from '@havue/color-picker'
</script>
```

## Examples

<script setup>
import Demo from '@/components/color-picker/index.vue'
</script>

<Demo></Demo>

::: details Click to view code
<<< ../../../demos/components/color-picker/index.vue{ts:line-numbers}
:::

## 配置

| Property              | Description   | Type         | Default                   |
| :-------------------- | :------------ | :----------- | :------------------------ |
| model-value / v-model | Bound value   | `string`   | `#ffffff`               |
| title                 | Title text    | `string`   | `颜色编辑器`            |
| presetTitle           | Preset title  | `string`   | `系统预设色彩`          |
| presetColors          | Preset colors | `string[]` | `DEFAULT_PRESET_COLORS` |

```ts
const DEFAULT_PRESET_COLORS [ '#000000','#FFFFFF','#E3822D','#DCE24F','#1DCF69','#6DE5B9','#11A1F2','#AA43FF','#F0689C','#F8D28B','#606368','#E83C34','#EEBE29','#89F0AC','#2FBC9E','#56CCF2','#1C1DFA','#DC88F5','#D4C595','#C52F65']
```
