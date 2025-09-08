# 拖动缩放

操作元素在父级容器元素内部移动，以及缩放。

## 安装

::: info
如果还需要使用其他组件，请参考[全量组件安装](./index.md)
:::

如果仅需要使用当前组件，执行以下命令单独安装:

::: code-group

```shell [npm]
npm install @havue/drag-and-scale --save
```

```shell [yarn]
yarn add @havue/drag-and-scale
```

```shell [pnpm]
pnpm install @havue/drag-and-scale
```

:::

## 引入

```vue
<script>
import { HvDragAndScale } from 'havue'
// or 
import { HvDragAndScale } from '@havue/components'
// or
import { HvDragAndScale } from '@havue/color-picker'
</script>
```

## 示例

设置容器实际尺寸为1920*1080。

第一个黑色元素限制最小尺寸64*64，保持宽高比，限制在容器中移动。

第二个灰色元素限制最小尺寸128\*128，最大尺寸512\*300。

<script setup lang="ts">
import Demo from '@/components/drag-and-scale/index.vue'
import CustemStyleDemo from '@/components/drag-and-scale/custom-style.vue'

</script>

<Demo></Demo>

::: details 点我看代码
::: code-group

<<< ../../../demos/components/drag-and-scale/index.vue#template{vue:line-numbers} [template]

<<< ../../../demos/components/drag-and-scale/index.vue#script{ts:line-numbers} [script]

<<< ../../../demos/components/drag-and-scale/index.vue#style{scss:line-numbers} [style]

:::

自定义样式

<CustemStyleDemo></CustemStyleDemo>

::: details 点我看代码
::: code-group

<<< ../../../demos/components/drag-and-scale/custom-style.vue#template{vue:line-numbers} [template]

<<< ../../../demos/components/drag-and-scale/custom-style.vue#script{ts:line-numbers} [script]

<<< ../../../demos/components/drag-and-scale/custom-style.vue#style{scss:line-numbers} [style]

:::

如果想禁用缩放功能，只保留拖动功能，可添加样式实现

```css
  .hv-drag-and-scale {
    --hv-dns-response-width: 0px;
    border: none;
  }
```

::: info
如果您使用的版本低于1.2.0, '--hv-dns-response-width' 应该为 '--scale-area-width'
:::

反之，如果想只保留缩放功能，禁用拖动功能，可添加以下样式实现

```scss
  .hv-drag-and-scale {
    .hv-drag-and-scale__area-center {
      pointer-events: none;
    }
  }
```

## 配置

:::tip
属性名后跟'?'表示该属性为可选属性。
:::

| 属性名                   | 说明                               | 类型                               | 默认值       |
| :----------------------- | :--------------------------------- | :--------------------------------- | :----------- |
| container                | 容器元素                           | `HTMLElement \| Ref<HTMLElement>` | —           |
| containerRealSize?       | 容器现实实际宽高                   | `object`                         | —           |
| containerRealSize.width  | 容器现实实际宽                     | `number`                         | —           |
| containerRealSize.height | 容器现实实际高                     | `number`                         | —           |
| keepRatio?               | 保持宽高比配置                     | `object`                         | —           |
| keepRatio.enable         | 是否保持宽高比                     | `boolean`                        | `false`    |
| keepRatio?.scaleCase     | 缩放时使用最大改动值还是最小改动值 | `'min' \| 'max'`                  | `'min'`    |
| limit?                   | 限制缩放的尺寸                     | `object`                         | —           |
| limit?.inContainer       | 限制缩放在父元素内部               | `boolean`                        | `true`     |
| limit?.minWidth          | 限制缩放的最小宽度                 | `number`                         | `0`        |
| limit?.minHeight         | 限制缩放的最小高度                 | `number`                         | `0`        |
| limit?.maxWidth          | 限制缩放的最大宽度                 | `number`                         | `Infinity` |
| limit?.maxHeight         | 限制缩放的最大高度                 | `number`                         | `Infinity` |
| disabled?                | 是否禁用                           | `boolean`                        | `false`    |

## 事件

| 事件   | 说明                   | 参数类型                                           |
| :----- | :--------------------- | :------------------------------------------------- |
| change | 拖动或者缩放时触发     | `(params: DragAndScaleChangeResultType) => void` |
| finish | 拖动或者缩放结束时触发 | `() => void`                                     |

```ts
type DragAndScaleChangeResultType {
  /** 操作类型 */
  type: 'move' | 'scale'
  /** 相比上一次change事件，横向移动的距离 */
  deltaX: number
  /** 相比上一次change事件，纵向移动的距离 */
  deltaY: number
  /** 拖动元素位于 container中的 x */
  elX: number
  /** 拖动元素位于 container中的 y */
  elY: number
  /** 拖动元素宽度 */
  elWidth: number
  /** 拖动元素高度 */
  elHeight: number
  /** 拖动元素基于containerRealSize 转换的实际x坐标 */
  realX: number
  /** 拖动元素基于containerRealSize 转换的实际y坐标 */
  realY: number
  /** 拖动元素基于containerRealSize 转换的实际宽度 */
  realWidth: number
  /** 拖动元素基于containerRealSize 转换的实际高度 */
  realHeight: number
}
```

## 插槽

| 名称    | 说明     |
| :------ | :------- |
| default | 默认内容 |
