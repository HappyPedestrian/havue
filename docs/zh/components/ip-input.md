# IP地址输入框

## 安装

::: info
如果还需要使用其他组件，请参考[全量组件安装](./index.md)
:::

如果仅需要使用颜色选择器，执行以下命令单独安装:

::: code-group

```shell
npm install @havue/ip-input --save
```

```shell
yarn add @havue/ip-input
```

```shell
pnpm install @havue/ip-input
```

:::

## 引入

```vue
<script>
import { HvIpInput } from 'havue'
// or 
import { HvIpInput } from '@havue/components'
// or
import HvIpInput from '@havue/ip-input'
</script>
```

## 示例

<script setup>
import Demo from '@/components/ip-input/index.vue'
</script>

<Demo></Demo>

::: details 点我看代码
<<< ../../../demos/components/ip-input/index.vue{ts:line-numbers}
:::

## 配置

| 属性名                | 说明     | 类型        | 默认值    |
| :-------------------- | :------- | :---------- | :-------- |
| model-value / v-model | 绑定值   | `string`  | `"..."` |
| disabled              | 是否禁用 | `boolean` | -         |
