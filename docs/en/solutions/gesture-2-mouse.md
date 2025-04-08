# Mobile Gesture Recognition

To install all solutions, please refer to [Solutions Installation](./index.md)

Listens for special gesture operations on mobile devices and converts them to PC operations (click, double-click, drag, two-finger swipe/mouse wheel, two-finger click/right-click events, etc.)

## Install this hook separately

::: code-group

```shell [npm]
npm install @havue/use-gesture-2-mouse --save
```

```shell [yarn]
yarn add @havue/use-gesture-2-mouse
```

```shell [pnpm]
pnpm install @havue/use-gesture-2-mouse
```

## Usage

Import:

```ts
import { useGestrue2Mouse } from 'havue'
// or
import { useGestrue2Mouse } from '@havue/hooks'
// or
import { useGestrue2Mouse } from '@havue/gesture-2-mouse'
```

## Example

The following area is an interactive zone. When operating, the page will display the current operation type.

<script setup lang="ts">
import Demo from '@/solutions/gesture-2-mouse/index.vue'

</script>

<Demo></Demo>

::: details Click to view code
::: code-group

<<< ../../../demos/solutions/gesture-2-mouse/index.vue#template{vue:line-numbers} [template]

<<< ../../../demos/solutions/gesture-2-mouse/index.vue#script{ts:line-numbers} [script]

<<< ../../../demos/solutions/gesture-2-mouse/index.vue#style{scss:line-numbers} [style]

:::

## useGestrue2Mouse Function Parameters

|       Parameter          |        Description         |      Type      |    default     |
| :------------------- | :------------------ | :-------------| :----------- |
| targetRealSize            | Real-world dimensions of target area (not page element dimensions)      | `MaybeRef<UseGestrue2MouseTargetRealSizeType>`        |   —   |
| target             | Target element. If not provided, returns `operateBoxRef` element reference      | `MaybeRef<HTMLElement \| undefined>`        |   —   |
| options             | Event handlers to listen to      | `Partial<UseGestrue2MouseEventOptions>`        |   —   |

Type Definitions

::: details Click to view code
<<< ../../../packages/hooks/use-gesture-2-mouse/src/index.ts#typedefine{ts:line-numbers}
:::
