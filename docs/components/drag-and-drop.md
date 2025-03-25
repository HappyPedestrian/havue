# 拖拽缩放

可在移动端和pc端使用的拖拽组件，分为两个组件Draggable和Droppable。

Draggable表示一个可拖动元素，

Droppable表示一个可放置拖动元素的区域。

为适应各种使用场景，Draggable可以配置其拖拽类型`type`，Droppable可配置允许拖拽的类型`acceptDragType`，

Droppalbe只接受`type`在其`acceptDragType`中的Draggalbe

## 示例

左侧标签块为Draggalbe元素，文本显示其类型和大小，灰色Draggalbe元素设置了`immediate="right"`,可向右立即拖动，

右侧有两个Droppable区域，green标签块只能拖放到green区域，yellow标签块只能拖放到yellow区域,

<script setup lang="ts">
import Demo from '@/components/drag-and-drop/index.vue'
</script>

<Demo></Demo>

::: details 点我看代码
::: code-group

<<< ../../demos/components/drag-and-drop/index.vue#template{vue:line-numbers} [template]

<<< ../../demos/components/drag-and-drop/index.vue#script{ts:line-numbers} [script]

<<< ../../demos/components/drag-and-drop/index.vue#style{scss:line-numbers} [style]
:::

## Draggable 属性

|  属性名   |        说明         |      类型      |    默认值     |
| :------- | :------------------ | :-------------| :----------- |
| type     | 拖拽元素类型         | `DragAndDropDragType`      | -            |
| immediate? | 拖拽元素立即响应拖动的方向，默认需要长按拖动   | `ImmediateType \| ImmediateType[]`      | -            |
| disabled? | 是否禁用             | `boolean`          | -            |
| data?     | 拖拽元素相关数据，供Droppable使用  | `any`    | -      |

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
