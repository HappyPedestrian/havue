# 移动端手势识别

监听移动端的特殊手势操作转换为pc端操作（单击、双击、拖动、双指滑动/鼠标滚轮、双指单击/鼠标右键等事件）

## 使用

引入

```ts
import { useOperateTransform } from '@pedy/gesture-2-mouse'
// or
import { useOperateTransform } from '@pedy/hooks'
```

## 示例

下面区域为可操作区域，操作时，页面显示当前操作类型

<script setup lang="ts">
import Demo from '@/solutions/gesture-2-mouse/index.vue'

</script>

<Demo></Demo>

::: details 点我看代码
::: code-group

<<< ../../demos/solutions/gesture-2-mouse/index.vue#template{vue:line-numbers} [template]

<<< ../../demos/solutions/gesture-2-mouse/index.vue#script{ts:line-numbers} [script]

<<< ../../demos/solutions/gesture-2-mouse/index.vue#style{scss:line-numbers} [style]

:::

## useOperateTransform函数参数

|       参数名          |        说明         |      类型      |    默认值     |
| :------------------- | :------------------ | :-------------| :----------- |
| targetRealSize            | 目标区域对应现实宽高（非页面元素宽高）      | `MaybeRef<UseGestrue2MouseTargetRealSizeType>`        |   —   |
| target             | 操作元素，如果不传，函数会返回一个`operateBoxRef`元素引用供外部使用      | `MaybeRef<HTMLElement \| undefined>`        |   —   |
| options             | 需要监听的事件处理函数      | `Partial<UseGestrue2MouseEventOptions>`        |   —   |

类型定义

::: details 点我看代码
<<< ../../packages/hooks/use-gesture-2-mouse/src/index.ts#typedefine{ts:line-numbers}
:::
