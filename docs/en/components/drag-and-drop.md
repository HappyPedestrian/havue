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

To listen to global drag events, you can also import the singleton manager:

```ts
import { DnDManagerInstance } from '@havue/drag-and-drop'
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
import ManagerEvents from '@/components/drag-and-drop/manager-events.vue'
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
| data?     | Data passed to Droppable events (third argument in drop/enter/move/leave) | `any`    | —      |

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

## Global drag manager `DnDManagerInstance` <Badge type="tip" text="^1.2.2" />

`DnDManagerInstance` is a global drag manager based on an internal event bus. It listens to mouse / touch events on `document.body`, and emits high‑level drag lifecycle events that you can subscribe to from anywhere.

```ts
import { onBeforeUnmount, onMounted } from 'vue'
import type { DnDManagerEvents } from '@havue/drag-and-drop'
import { DnDManagerInstance } from '@havue/drag-and-drop'

const handleMove: DnDManagerEvents['move'] = ({ type, data, point }) => {
  console.log('move', type, data, point)
}

onMounted(() => {
  DnDManagerInstance.on('move', handleMove)
})

onBeforeUnmount(() => {
  DnDManagerInstance.off('move', handleMove)
})
```

### Event types

```ts
type DragAndDropPoint = {
  x: number
  y: number
}

type DragAndDropDragType = string | number | symbol

type DnDManagerEvents = {
  down: (p: DragAndDropPoint) => void
  'first-move': (p: DragAndDropPoint, e: MouseEvent | TouchEvent) => void
  start: (p: DragAndDropPoint) => void
  move: (params: { type: DragAndDropDragType; data: any; point: DragAndDropPoint }) => void
  end: (params: { type: DragAndDropDragType; data: any; point: DragAndDropPoint }) => void
}
```

| Event       | Description                                                                 | Parameters                                                                                 |
| :---------- | :-------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `down`      | Triggered when pointer is pressed down, before drag is started              | `(point: DragAndDropPoint)`                                                                |
| `first-move`| First pointer move after `down`, before drag is confirmed                   | `(point: DragAndDropPoint, e: MouseEvent \| TouchEvent)`                                   |
| `start`     | Drag is confirmed (long‑press or threshold reached)                         | `(point: DragAndDropPoint)`                                                                |
| `move`      | Fired on every drag move while dragging                                     | `({ type: DragAndDropDragType, data: any, point: DragAndDropPoint })`                      |
| `end`       | Fired when drag ends (mouse / touch release, or cancelled)                 | `({ type: DragAndDropDragType, data: any, point: DragAndDropPoint })`                      |

### DnDManagerInstance events demo

The following demo shows how to subscribe to these events and display them in real time:

<ManagerEvents></ManagerEvents>

:::: details Click to view code (DnDManagerInstance demo)
::: code-group

<<< ../../../demos/components/drag-and-drop/manager-events.vue#template{vue:line-numbers} [template]

<<< ../../../demos/components/drag-and-drop/manager-events.vue#script{ts:line-numbers} [script]

<<< ../../../demos/components/drag-and-drop/manager-events.vue#style{scss:line-numbers} [style]
:::
::::
