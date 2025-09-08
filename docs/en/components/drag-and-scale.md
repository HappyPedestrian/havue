# Drag and Scale

Operate elements to move within the parent container and perform scaling.

## Installation

::: info
If you need to use other components, please refer to[Full Components Installation](./index.md)
:::

To install this component individually, run the following command:

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

## Import

```vue
<script>
import { HvDragAndScale } from 'havue'
// or 
import { HvDragAndScale } from '@havue/components'
// or
import { HvDragAndScale } from '@havue/color-picker'
</script>
```

## Examples

Set container actual dimensions to 1920x1080.

The first black element limits minimum size to 64x64, maintains aspect ratio, and restricts movement within the container.

The second gray element limits minimum size to 128x128 and maximum size to 512x300.

<script setup lang="ts">
import Demo from '@/components/drag-and-scale/index.vue'
import CustemStyleDemo from '@/components/drag-and-scale/custom-style.vue'

</script>

<Demo></Demo>

Custom style

<CustemStyleDemo></CustemStyleDemo>

::: details Click to view code
::: code-group

<<< ../../../demos/components/drag-and-scale/index.vue#template{vue:line-numbers} [template]

<<< ../../../demos/components/drag-and-scale/index.vue#script{ts:line-numbers} [script]

<<< ../../../demos/components/drag-and-scale/index.vue#style{scss:line-numbers} [style]

:::

To disable scaling while keeping dragging, add these styles:

```css
  .hv-drag-and-scale {
    --hv-dns-response-width: 0px;
    border: none;
  }
```

::: info
If you're using a version below 1.2.0, '--hv-dns-response-width' should be '--scale-area-width'
:::

To disable dragging while keeping scaling, add these styles:

```scss
  .hv-drag-and-scale {
    .hv-drag-and-scale__area-center {
      pointer-events: none;
    }
  }
```

## Props

:::tip
Properties marked with '?' are optional.
:::

|          Property          |        Description         |      Type      |    Default     |
| :----------------------- | :------------------ | :-------------| :----------- |
| container                | Container element             | `HTMLElement \| Ref<HTMLElement>`     |   —   |
| containerRealSize?       | Actual physical dimensions of container      | `object`        | —           |
| containerRealSize.width  | Actual physical width        | `number`        | —           |
| containerRealSize.height | Actual physical height        | `number`        | —           |
| keepRatio?                | Aspect ratio configuration        | `object`        | —           |
| keepRatio.enable         | Whether to maintain aspect ratio        | `boolean`       | `false`       |
| keepRatio?.scaleCase      | Use min/max delta when scaling      | `'min' \| 'max'`  |     `'min'`     |
| limit?                   | Size constraints        | `object`        |  —          |
| limit?.inContainer        | Restrict within parent   | `boolean`      |  `true`      |
| limit?.minWidth           | Minimum width limit     | `number`       | `0`           |
| limit?.minHeight          | Minimum height limit     | `number`       | `0`           |
| limit?.maxWidth           | Maximum width limit     | `number`       | `Infinity`           |
| limit?.maxHeight          | Maximum height limit     | `number`       | `Infinity`           |
| disabled?                | Disable interaction              | `boolean`       | `false`           |

## Events

|   Event     |        Description          |            Parameters                |
| :-------  | :------------------ | :-------------------------------   |
| change     | Triggered during drag/scale    | `(params: DragAndScaleChangeResultType) => void`    |
| finish  | Triggered after drag/scale ends    | `() => void`                     |

```ts
type DragAndScaleChangeResultType {
  /** Operation type */
  type: 'move' | 'scale'
  /** Horizontal distance moved compared to last change event */
  deltaX: number
  /** Vertical distance moved compared to last change event */
  deltaY: number
  /** Element X position in container */
  elX: number
  /** Element Y position in container */
  elY: number
  /** Element width */
  elWidth: number
  /** Element height */
  elHeight: number
  /** Actual X coordinate converted via containerRealSize */
  realX: number
  /** Actual Y coordinate converted via containerRealSize */
  realY: number
  /** Actual width converted via containerRealSize */
  realWidth: number
  /** Actual height converted via containerRealSize */
  realHeight: number
}
```

## Slots

|   Slots       |    Description     |
| :----------- | :------------------ |
| default      | Default content     |
