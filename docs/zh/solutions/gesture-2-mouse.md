# 移动端手势识别

如需安装所有解决方案，请参考[全量解决方案安装](./index.md)

监听移动端的特殊手势操作转换为pc端操作（单击、双击、拖动、双指滑动/鼠标滚轮、双指单击/鼠标右键等事件）

## 单独安装此hook

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

## 使用

引入

```ts
import { useGestrue2Mouse } from 'havue'
// or
import { useGestrue2Mouse } from '@havue/hooks'
// or
import { useGestrue2Mouse } from '@havue/gesture-2-mouse'
```

## 示例

下面区域为可操作区域，操作时，页面显示当前操作类型

<script setup lang="ts">
import Demo from '@/solutions/gesture-2-mouse/index.vue'

</script>

<Demo></Demo>

::: details 点我看代码
::: code-group

<<< ../../../demos/solutions/gesture-2-mouse/index.vue#template{vue:line-numbers} [template]

<<< ../../../demos/solutions/gesture-2-mouse/index.vue#script{ts:line-numbers} [script]

<<< ../../../demos/solutions/gesture-2-mouse/index.vue#style{scss:line-numbers} [style]

:::

## useGestrue2Mouse 参数

::: tip 函数名说明
函数名为 `useGestrue2Mouse`（Gesture 拼写为 Gestrue），与源码导出一致。
:::

|       参数名             |        说明         |      类型      |    默认值     |
| :----------------------- | :------------------ | :-------------| :----------- |
| target                   | 操作元素，如果不传，函数会返回一个`operateBoxRef`元素引用供外部使用      | `MaybeRef<HTMLElement \| undefined>`        |   —   |
| options                  | 配置      | `Partial<UseGestrue2MouseEventOptions>`        |   —   |
| options?.TargetRealSize  | 目标区域对应现实宽高（非页面元素宽高）      | `MaybeRef<UseGestrue2MouseTargetRealSizeType>`        |   —   |
| options?.onMouseEvent    | 鼠标点击事件      | `(e: UseGestrue2MouseTargetPositionType, button?: UseGestrue2MouseMouseButtonType) => void`        |   —   |
| options?.onMouseWheel    | 鼠标滚轮事件      | `(e: UseGestrue2MouseTargetPositionType, deltaY: number) => void`        |   —   |
| options?.throttle        | 节流配置（lodash throttle） | `{ wait: number; leading?: boolean; trailing?: boolean }` | — |

**返回值**：`{ operateBoxRef: Ref<HTMLElement | undefined> }`。当未传入 `target` 时，可将 `operateBoxRef` 绑定到模板元素作为操作区域。

## 类型定义

::: details 点我看代码
<<< ../../../packages/hooks/use-gesture-2-mouse/src/index.ts#typedefine{ts:line-numbers}
:::
