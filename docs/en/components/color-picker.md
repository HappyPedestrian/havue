# Color Picker

## Installation

::: info
If other components are needed, please refer to[Full Components Installation](./index.md)
:::

To install the Color Picker individually, run the following command:

::: code-group

```shell
npm install @havue/color-picker --save
```

```shell
yarn add @havue/color-picker
```

```shell
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
import NormalDemo from '@/components/color-picker/normal.vue'
</script>

<Demo></Demo>

::: details Click to view code
<<< ../../../demos/components/color-picker/index.vue{ts:line-numbers}
:::

<NormalDemo></NormalDemo>

::: details Click to view code
<<< ../../../demos/components/color-picker/normal.vue{ts:line-numbers}
:::

## HvColorPicker Props

| Property              | Description   | Type         | Default                   |
| :-------------------- | :------------ | :----------- | :------------------------ |
| model-value / v-model | Bound value   | `string`   | `#ffffff`               |
| disabled  <Badge type="tip" text="^1.1.3" />      | Disable interaction    | `boolean`   | _            |
| title                 | Title text    | `string`   | `颜色编辑器`            |
| presetTitle           | Preset title  | `string`   | `系统预设色彩`          |
| presetColors          | Preset colors | `string[]` | `DEFAULT_PRESET_COLORS` |

## HvColorPickerNormal Props <Badge type="tip" text="^1.1.3" />

| Property              | Description   | Type         | Default                   |
| :-------------------- | :------------ | :----------- | :------------------------ |
| model-value / v-model | Bound value   | `string`   | `#ffffff`               |
| disabled              | Disable interaction    | `boolean`   | _            |
| enableAlpha           | Whether alpha prop can be set  | `boolean`   | `true`            |
| presetTitle           | Preset title  | `string`   | `系统预设色彩`          |
| presetColors          | Preset colors | `string[]` | `DEFAULT_PRESET_COLORS` |

```ts
const DEFAULT_PRESET_COLORS [ '#000000','#FFFFFF','#E3822D','#DCE24F','#1DCF69','#6DE5B9','#11A1F2','#AA43FF','#F0689C','#F8D28B','#606368','#E83C34','#EEBE29','#89F0AC','#2FBC9E','#56CCF2','#1C1DFA','#DC88F5','#D4C595','#C52F65']
```
