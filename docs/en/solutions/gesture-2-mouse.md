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

:::

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

## useGestrue2Mouse Parameters

::: tip Function name
The function is named `useGestrue2Mouse` (Gesture spelled as Gestrue), matching the package export.
:::

| Parameter | Description | Type | Default |
| :-------- | :---------- | :--- | :------ |
| target | Target element. If not provided, the function returns `operateBoxRef` for you to bind to the template | `MaybeRef<HTMLElement \| undefined>` | — |
| options | Configuration | `Partial<UseGestrue2MouseEventOptions>` | — |
| options?.TargetRealSize | Real-world dimensions of target area (not DOM size) | `MaybeRef<UseGestrue2MouseTargetRealSizeType>` | — |
| options?.onMouseEvent | Mouse click handler | `(e, button?) => void` | — |
| options?.onMouseWheel | Mouse wheel handler | `(e, deltaY) => void` | — |
| options?.throttle | Throttle options (lodash throttle) | `{ wait: number; leading?: boolean; trailing?: boolean }` | — |

**Returns**: `{ operateBoxRef: Ref<HTMLElement | undefined> }`. When `target` is omitted, bind `operateBoxRef` to your template element as the interaction zone.

## Type Definitions

::: details Click to view code
<<< ../../../packages/hooks/use-gesture-2-mouse/src/index.ts#typedefine{ts:line-numbers}
:::
