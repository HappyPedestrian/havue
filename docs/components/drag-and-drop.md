# 拖拽缩放

可在移动端和pc端使用的拖拽组件
分为两个组件Draggable和Droppable
Draggable表示一个可拖动元素
Droppable表示一个可放置拖动元素的区域

## 示例

<script setup lang="ts">
import Demo from '@/components/DragAndDrop/Demo.vue'
</script>

<Demo></Demo>

::: details 点我看代码
::: code-group

<<< ../../src/components/DragAndDrop/Demo.vue#template{vue:line-numbers} [template]

<<< ../../src/components/DragAndDrop/Demo.vue#script{ts:line-numbers} [script]

<<< ../../src/components/DragAndDrop/Demo.vue#style{scss:line-numbers} [style]
:::

## Draggable 属性

|  属性名   |        说明         |      类型      |    默认值     |
| :------- | :------------------ | :-------------| :----------- |
| type     | 拖拽元素类型         | `DragType`      | -            |
| disabled | 是否禁用             | `any`          | -            |
| data     | 拖拽元素相关数据，供Droppable使用  | `any`    | -      |

```ts
DragType: string | number | symbol
```

## Droppable 属性

|  属性名   |        说明         |      类型      |    默认值     |
| :------- | :------------------ | :-------------| :----------- |
| acceptDragType   | 可接受拖拽元素类型         | `DragType \| Array<DragType>` | - |

## Droppable 事件

|    事件    |        说明               |            参数类型                  |
| :--------- | :----------------------- | :------------------------------------|
| enter     | Draggable进入时触发        | `(type: DragType, point: Point, data: any) => void`    |
| move      | Draggable在区域内拖动时触发 | `(type: DragType, point: Point, data: any) => void`    |
| drop      | Draggable放下时触发        | `(type: DragType, point: Point, data: any) => void`     |
| leave     | Draggable离开时触发        | `(type: DragType, data: any) => void`                            |

```ts
Point: {
  /** 在Droppable中的横坐标 */
  x: string
  /** 在Droppable中的纵坐标 */
  y: string
}
```
