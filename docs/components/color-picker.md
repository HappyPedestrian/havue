# 颜色选择器

## 安装

::: info
如何还需要使用其他组件，请参考[全量组件安装](./index.md)
:::

如果仅需要使用颜色选择器，执行以下命令单独安装

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
import { PdColorPicker } from 'havue'
// or 
import { PdColorPicker } from '@havue/components'
// or
import { PdColorPicker } from '@havue/color-picker'
</script>
```

## 示例

<script setup>
import Demo from '@/components/color-picker/index.vue'
</script>

<Demo></Demo>

::: details 点我看代码
<<< ../../demos/components/color-picker/index.vue{ts:line-numbers}
:::

## 配置

|          属性名          |        说明         |      类型      |    默认值     |
| :----------------------- | :------------------ | :-------------| :----------- |
| model-value / v-model    | 绑定值              | `string`      |   `#ffffff`   |
