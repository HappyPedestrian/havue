# 拖动缩放

## 示例

<script setup lang="ts">
import Demo from '@/components/DragAndScale/Demo.vue'

</script>

<Demo></Demo>

::: code-group
<<< ../../src/components/DragAndScale/Demo.vue#template{1} [template]

<<< ../../src/components/DragAndScale/Demo.vue#script{1} [script]

<<< ../../src/components/DragAndScale/Demo.vue#style{1} [style]

:::

## 配置

|          属性名          |        说明         |      类型      |    默认值     |
| :----------------------- | :------------------ | :-------------| :----------- |
| container                | 容器元素             | HTMLElement &#124; Ref &lt;HTMLElement &gt;     |   —   |
| containerRealSize?       | 容器现实实际宽高      | object        | —           |
| containerRealSize.width  | 容器现实实际宽        | number        | —           |
| containerRealSize.height | 容器现实实际高        | number        | —           |
| keepRatio?                | 保持宽高比配置        | object        | —           |
| keepRatio.enable         | 是否保持宽高比        | boolean       | false       |
| keepRatio.scaleCase      | 缩放时使用最大改动值还是最小改动值      | 'min' &#124; 'max'  |     'min'     |
| limit?                   | 限制缩放的尺寸        | object        |  —          |
| limit.minWidth           | 限制缩放的最小宽度     | number       | 0           |
| limit.minHeight          | 限制缩放的最小高度     | number       | 0           |

## 事件

|   事件     |        说明          |            参数类型                |
| :-------  | :------------------ | :-------------------------------   |
| change     | 拖动或者缩放时触发    | (params: ChangeParamsType) => void    |
| finish  | 拖动或者缩放结束时触发    | () => void                     |

```ts
type ChangeParamsType {
  /** 拖动元素位于 container中的 x */
  elX: number
  /** 拖动元素位于 container中的 y */
  elY: number
  /** 拖动元素宽度 */
  elWidth: number
  /** 拖动元素高度 */
  elHeight: number
  /** 拖动元素基于containerRealSize 转换的实际x坐标 */
  realX: number
  /** 拖动元素基于containerRealSize 转换的实际y坐标 */
  realY: number
  /** 拖动元素基于containerRealSize 转换的实际宽度 */
  realWidth: number
  /** 拖动元素基于containerRealSize 转换的实际高度 */
  realHeight: number
}
```
