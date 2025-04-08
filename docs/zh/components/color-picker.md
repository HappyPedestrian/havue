# 颜色选择器

## 安装

::: info
如果还需要使用其他组件，请参考[全量组件安装](./index.md)
:::

如果仅需要使用颜色选择器，执行以下命令单独安装:

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
</script>

<Demo></Demo>

::: details 点我看代码
<<< ../../../demos/components/color-picker/index.vue{ts:line-numbers}
:::

## 配置

|          属性名          |        说明         |      类型      |    默认值     |
| :----------------------- | :------------------ | :-------------| :----------- |
| model-value / v-model    | 绑定值              | `string`      |   `#ffffff`   |
| title                    | 标题文字            | `string`      |   `颜色编辑器`   |
| presetTitle              | 预设标题            | `string`      |   `系统预设色彩`  |
| presetColors             | 预设颜色            | `string[]`      |   `DEFAULT_PRESET_COLORS`  |

```ts
const DEFAULT_PRESET_COLORS [ '#000000','#FFFFFF','#E3822D','#DCE24F','#1DCF69','#6DE5B9','#11A1F2','#AA43FF','#F0689C','#F8D28B','#606368','#E83C34','#EEBE29','#89F0AC','#2FBC9E','#56CCF2','#1C1DFA','#DC88F5','#D4C595','#C52F65']
```
