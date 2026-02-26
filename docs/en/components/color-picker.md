# Color Picker

## Installation

::: info
If other components are needed, please refer to [Full Components Installation](./index.md)
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
<<< ../../../demos/components/color-picker/index.vue{vue:line-numbers}
:::

<NormalDemo></NormalDemo>

::: details Click to view code
<<< ../../../demos/components/color-picker/normal.vue{vue:line-numbers}
:::

## Component overview

- **HvColorPicker (Rainbow)**: Hue bar + brightness/saturation area, for quick color picking.
- **HvColorPickerNormal** <Badge type="tip" text="^1.2.0" />: Hue + saturation/value + optional alpha, for precise transparency.

## ColorPicker Props

| Property              | Description   | Type         | Default                   |
| :-------------------- | :------------ | :----------- | :------------------------ |
| model-value / v-model | Bound value   | `string`    | `#ffffff`                 |
| disabled <Badge type="tip" text="^1.2.0" /> | Disable      | `boolean`   | —                         |
| title                 | Title text    | `string`    | `Color picker`            |
| presetTitle           | Preset title  | `string`    | `Preset colors`            |
| presetColors          | Preset colors | `string[]`  | `DEFAULT_PRESET_COLORS`   |

## ColorPickerNormal Props <Badge type="tip" text="^1.2.0" />

| Property              | Description        | Type       | Default                 |
| :-------------------- | :----------------- | :--------- | :----------------------- |
| model-value / v-model | Bound value        | `string`  | `#ffffff`                |
| disabled              | Disable            | `boolean` | —                        |
| enableAlpha           | Enable alpha slider | `boolean` | `true`                   |
| presetTitle           | Preset title       | `string`  | `Preset colors`          |
| presetColors          | Preset colors      | `string[]` | `DEFAULT_PRESET_COLORS` |

## Events

Both components use `v-model`; they emit `update:model-value` with the current color hex string.

## Preset colors constant

Override via `presetColors`. Default:

```ts
const DEFAULT_PRESET_COLORS = ['#000000','#FFFFFF','#E3822D','#DCE24F','#1DCF69','#6DE5B9','#11A1F2','#AA43FF','#F0689C','#F8D28B','#606368','#E83C34','#EEBE29','#89F0AC','#2FBC9E','#56CCF2','#1C1DFA','#DC88F5','#D4C595','#C52F65']
```
