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

::: code-group
<<< ../../src/components/DragAndDrop/Demo.vue#template{1} [template]

<<< ../../src/components/DragAndDrop/Demo.vue#script{1} [script]

<<< ../../src/components/DragAndDrop/Demo.vue#style{1} [style]
:::

## Draggable 属性

|  属性名   |        说明         |      类型      |    默认值     |
| :------- | :------------------ | :-------------| :----------- |
| type     | 拖拽元素类型         | DragType      | -            |
| data     | 拖拽元素相关数据，供Droppable使用  | any    | -      |

```ts
DragType: string | number | symbol
```

## Droppable 属性

|  属性名   |        说明         |      类型      |    默认值     |
| :------- | :------------------ | :-------------| :----------- |
| acceptDragType   | 可接受拖拽元素类型         | DragType &#124; Array&lt;DragType&gt; | - |

## Droppable 事件

|    事件    |        说明               |            参数类型                  |
| :--------- | :----------------------- | :------------------------------------|
| enter     | Draggable进入是触发        | (point: Point, data: any) => void    |
| move      | Draggable在区域内拖动时触发 | (point: Point, data: any) => void    |
| drop      | Draggable放下时触发        | (point: Point, data: any) => void     |
| leave     | Draggable离开时触发        | () => void                            |

```ts
Point: {
  /** 在Droppable中的横坐标 */
  x: string
  /** 在Droppable中的纵坐标 */
  y: string
}
```
