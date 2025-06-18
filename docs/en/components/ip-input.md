# IP Address Input

## Installation

::: info
If other components are needed, please refer to[Full Components Installation](./index.md)
:::

To install the IP Address Input individually, run the following command:

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

## Import

```vue
<script>
import { HvIpInput } from 'havue'
// or 
import { HvIpInput } from '@havue/components'
// or
import HvIpInput from '@havue/ip-input'
</script>
```

## Example

<script setup>
import Demo from '@/components/ip-input/index.vue'
</script>

`<Demo></Demo>`

::: details Click to view code
<<< ../../../demos/components/ip-input/index.vue{ts:line-numbers}
:::

## Props

| Property              | Description         | Type        | Default   |
| :-------------------- | :------------------ | :---------- | :-------- |
| model-value / v-model | Bound value         | `string`  | `"..."` |
| disabled              | Disable interaction | `boolean` | -         |
