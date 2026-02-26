# 颜色选择器

## 安装

::: info
如果还需要使用其他组件，请参考[全量组件安装](./index.md)
:::

如果仅需要使用颜色选择器，执行以下命令单独安装:

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

## 引入

```vue
<script>
import { HvColorPicker } from 'havue'
// or 
import { HvColorPicker } from '@havue/components'
// or
import { HvColorPicker } from '@havue/color-picker'
</script>
```

## 示例

<script setup>
import Demo from '@/components/color-picker/index.vue'
import NormalDemo from '@/components/color-picker/normal.vue'
</script>

<Demo></Demo>

::: details 点我看代码
<<< ../../../demos/components/color-picker/index.vue{vue:line-numbers}
:::

<NormalDemo></NormalDemo>

::: details 点我看代码
<<< ../../../demos/components/color-picker/normal.vue{vue:line-numbers}
:::

## 组件说明

- **HvColorPicker（彩虹条）**：色相条 + 亮度/饱和度区域，适合快速选色。
- **HvColorPickerNormal** <Badge type="tip" text="^1.2.0" />：色相条 + 饱和度/明度 + 可选透明度，适合需要精确透明度的场景。

## ColorPicker 属性

| 属性名                | 说明     | 类型       | 默认值              |
| :-------------------- | :------- | :--------- | :------------------ |
| model-value / v-model | 绑定值   | `string`  | `#ffffff`           |
| disabled <Badge type="tip" text="^1.2.0" /> | 是否禁用 | `boolean` | —                   |
| title                 | 标题文字 | `string`  | `Color picker`      |
| presetTitle           | 预设标题 | `string`  | `Preset colors`     |
| presetColors          | 预设颜色 | `string[]` | `DEFAULT_PRESET_COLORS` |

## ColorPickerNormal 属性 <Badge type="tip" text="^1.2.0" />

| 属性名                | 说明           | 类型       | 默认值              |
| :-------------------- | :------------- | :--------- | :------------------ |
| model-value / v-model | 绑定值         | `string`  | `#ffffff`           |
| disabled              | 是否禁用       | `boolean` | —                   |
| enableAlpha           | 是否可设置透明度 | `boolean` | `true`              |
| presetTitle           | 预设标题       | `string`  | `Preset colors`     |
| presetColors          | 预设颜色       | `string[]` | `DEFAULT_PRESET_COLORS` |

## 事件

两个组件均通过 `v-model` 双向绑定，会触发 `update:model-value`，值为当前颜色 hex 字符串。

## 预设颜色常量

可通过 `presetColors` 覆盖默认预设；默认值为：

```ts
const DEFAULT_PRESET_COLORS = ['#000000','#FFFFFF','#E3822D','#DCE24F','#1DCF69','#6DE5B9','#11A1F2','#AA43FF','#F0689C','#F8D28B','#606368','#E83C34','#EEBE29','#89F0AC','#2FBC9E','#56CCF2','#1C1DFA','#DC88F5','#D4C595','#C52F65']
```
