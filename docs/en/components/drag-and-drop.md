# Drag And Drop

Drag and Drop Scaling
A drag-and-drop component that works on both mobile and PC, consisting of two components: `Draggable` and `Droppable`.

* Draggable: Represents a draggable element.
* Droppable: Represents an area where draggable elements can be dropped.

To accommodate various use cases:

* `Draggable` can configure its drag type via `type`.
* `Droppable` can configure allowed drag types via `acceptDragType`.
* `Droppable` only accepts `Draggable` elements whose `type` is included in its `acceptDragType`.

## Installation

::: info
If you need other components, refer to [Full Components Installation](./index.md)
:::

To install this component individually, run:

::: code-group

```shell [npm]
npm install @havue/drag-and-drop --save
```

```shell [yarn]
yarn add @havue/drag-and-drop
```

```shell [pnpm]
pnpm install @havue/drag-and-drop
```

:::

## Import

```vue
<script>
import { HvDraggable, HvDroppable } from 'havue'
// or 
import { HvDraggable, HvDroppable } from '@havue/components'
// or
import { HvDraggable, HvDroppable } from '@havue/drag-and-drop'
</script>
```

## Example

* Left-side label blocks are Draggable elements, displaying their type and size.
* The ​gray Draggable element has `immediate="right"`, allowing instant dragging to the right.
* The yellow labels sets the drag-item custom slot display.
* ​Right-side contains two Droppable areas:
  * Green labels can only be dropped in the green area.
  * Yellow labels can only be dropped in the yellow area.

<script setup lang="ts">
import Demo from '@/components/drag-and-drop/index.vue'
</script>

<Demo></Demo>

::: details Click to view code
::: code-group

<<< ../../../demos/components/drag-and-drop/index.vue#template{vue:line-numbers} [template]

<<< ../../../demos/components/drag-and-drop/index.vue#script{ts:line-numbers} [script]

<<< ../../../demos/components/drag-and-drop/index.vue#style{scss:line-numbers} [style]
:::

## Draggable Props

|  Property   |        Description         |      Type      |    Default     |
| :------- | :------------------ | :-------------| :----------- |
| type     | Drag element type         | `DragAndDropDragType`      | -            |
| immediate? | Direction where the element responds to drag immediately (default requires long-press)   | `ImmediateType \| ImmediateType[]`      | -            |
| disabled? | Whether the element is disabled             | `boolean`          | -            |
| data?     | Data associated with the draggable element (passed to Droppable)  | `any`    | -      |

```ts
type DragAndDropDragType: string | number | symbol

type ImmediateType = 'left' | 'right' | 'top' | 'bottom' | 'all' | undefined
```

## Draggable Slots

|   Slot Name       |        Description          |
| :----------- | :------------------ |
| default      | Default content             |
| drag-item    | Element displayed during dragging         |

## Droppable Props

|  Property   |        Description         |      Type      |    Default     |
| :------- | :------------------ | :-------------| :----------- |
| acceptDragType   | Accepted drag types         | `DragAndDropDragType \| Array<DragAndDropDragType>` | - |
| disabled? <Badge type="tip" text="^1.2.0" />| Whether the element is disabled      | `boolean`          | -            |

## Droppable Events

|    Event    |        Description               |            Parameter Types                  |
| :--------- | :----------------------- | :------------------------------------|
| enter     | Triggered when `Draggable` enters the area      | `(type: DragType, point: DragAndDropPoint, data: any) => void`    |
| move      | Triggered while `Draggable` moves within the area | `(type: DragType, point: DragAndDropPoint, data: any) => void`    |
| drop      | Triggered when `Draggable` is dropped        | `(type: DragType, point: DragAndDropPoint, data: any) => void`     |
| leave     | Triggered when `Draggable` leaves the area        | `(type: DragType, data: any) => void`                            |

```ts
DragAndDropPoint: {
  /** X-coordinate within Droppable */
  x: string
  /** Y-coordinate within Droppable */
  y: string
}
```

## Droppable Slots

|   Slot Name  |     Description     |
| :----------- | :------------------ |
|   default    | Default content     |
