# 拖拽

可在移动端和pc端使用的拖拽组件，分为两个组件：`Draggable`和`Droppable`。

* Draggable：表示一个可拖动元素。
* Droppable：表示一个可放置拖动元素的区域。

为适应各种使用场景：

* `Draggable`可以配置其拖拽类型`type`。
* `Droppable`可配置允许拖拽的类型`acceptDragType`。
* `Droppable` 只接受 `type` 在其 `acceptDragType` 中的 `Draggable`。

## 安装

::: info
如果还需要使用其他组件，请参考[全量组件安装](./index.md)
:::

如果仅需要使用当前组件，执行以下命令单独安装:

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

## 引入

```vue
<script>
import { HvDraggable, HvDroppable } from 'havue'
// or 
import { HvDraggable, HvDroppable } from '@havue/components'
// or
import { HvDraggable, HvDroppable } from '@havue/drag-and-drop'
</script>
```

如果你需要在任意地方全局监听拖拽过程中的事件，也可以直接引入全局拖拽管理器：

```ts
import { DnDManagerInstance } from '@havue/drag-and-drop'
```

## 示例

* 左侧标签块为 Draggable 元素，文本显示其类型和大小。
* 灰色 Draggable 元素设置了 `immediate="right"`，可向右立即拖动。
* yellow 标签块设置了 `drag-item` 自定义插槽展示。
* 右侧有两个 Droppable 区域：green 标签块只能拖放到 green 区域，yellow 标签块只能拖放到 yellow 区域。

<script setup lang="ts">
import Demo from '@/components/drag-and-drop/index.vue'
import ManagerEvents from '@/components/drag-and-drop/manager-events.vue'
</script>

<Demo></Demo>

::: details 点我看代码
::: code-group

<<< ../../../demos/components/drag-and-drop/index.vue#template{vue:line-numbers} [template]

<<< ../../../demos/components/drag-and-drop/index.vue#script{ts:line-numbers} [script]

<<< ../../../demos/components/drag-and-drop/index.vue#style{scss:line-numbers} [style]
:::

## Draggable 属性

|  属性名   |        说明         |      类型      |    默认值     |
| :------- | :------------------ | :-------------| :----------- |
| type     | 拖拽元素类型         | `DragAndDropDragType`      | -            |
| immediate? | 拖拽元素立即响应拖动的方向，默认需要长按拖动   | `ImmediateType \| ImmediateType[]`      | -            |
| disabled? | 是否禁用             | `boolean`          | -            |
| data?     | 拖拽时传给 Droppable 事件的数据，在 drop/enter/move/leave 的第三个参数中获取 | `any`    | —      |

```ts
type DragAndDropDragType: string | number | symbol

type ImmediateType = 'left' | 'right' | 'top' | 'bottom' | 'all' | undefined
```

## Draggable 插槽

|   名称       |        说明          |
| :----------- | :------------------ |
| default      | 默认内容             |
| drag-item    | 拖动展示元素         |

## Droppable 属性

|  属性名   |        说明         |      类型      |    默认值     |
| :------- | :------------------ | :-------------| :----------- |
| acceptDragType   | 可接受拖拽元素类型         | `DragAndDropDragType \| Array<DragAndDropDragType>` | - |
| disabled? <Badge type="tip" text="^1.2.0" />| 是否禁用             | `boolean`          | -            |

## Droppable 事件

|    事件    |        说明               |            参数类型                  |
| :--------- | :----------------------- | :------------------------------------|
| enter     | Draggable进入时触发        | `(type: DragType, point: DragAndDropPoint, data: any) => void`    |
| move      | Draggable在区域内拖动时触发 | `(type: DragType, point: DragAndDropPoint, data: any) => void`    |
| drop      | Draggable放下时触发        | `(type: DragType, point: DragAndDropPoint, data: any) => void`     |
| leave     | Draggable离开时触发        | `(type: DragType, data: any) => void`                            |

```ts
DragAndDropPoint: {
  /** 在Droppable中的横坐标 */
  x: string
  /** 在Droppable中的纵坐标 */
  y: string
}
```

## Droppable 插槽

|   名称       |        说明          |
| :----------- | :------------------ |
| default      | 默认内容             |

## 全局拖拽管理器 `DnDManagerInstance` <Badge type="tip" text="^1.2.2" />

`DnDManagerInstance` 是基于内部事件总线实现的全局拖拽管理器，会在 `document.body` 上监听鼠标 / 触摸事件，并对外派发一组拖拽生命周期事件，方便你在任意地方统一监听。

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

### 事件类型

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

| 事件名        | 说明                                             | 参数                                                                                      |
| :------------ | :----------------------------------------------- | :---------------------------------------------------------------------------------------- |
| `down`        | 指针按下时触发，此时还未真正开始拖拽             | `(point: DragAndDropPoint)`                                                               |
| `first-move`  | `down` 之后第一次移动时触发，用于判断是否开始拖拽 | `(point: DragAndDropPoint, e: MouseEvent \| TouchEvent)`                                  |
| `start`       | 确认进入拖拽状态时触发（长按或位移达到阈值）     | `(point: DragAndDropPoint)`                                                               |
| `move`        | 拖拽过程中持续触发                               | `({ type: DragAndDropDragType, data: any, point: DragAndDropPoint })`                     |
| `end`         | 拖拽结束（松开鼠标 / 触点，或被取消）时触发      | `({ type: DragAndDropDragType, data: any, point: DragAndDropPoint })`                     |

### DnDManagerInstance 事件监听示例

下面的示例展示了如何订阅这些事件并实时在页面上展示：

<ManagerEvents></ManagerEvents>

:::: details 点我看代码（DnDManagerInstance 示例）
::: code-group

<<< ../../../demos/components/drag-and-drop/manager-events.vue#template{vue:line-numbers} [template]

<<< ../../../demos/components/drag-and-drop/manager-events.vue#script{ts:line-numbers} [script]

<<< ../../../demos/components/drag-and-drop/manager-events.vue#style{scss:line-numbers} [style]
:::
::::
