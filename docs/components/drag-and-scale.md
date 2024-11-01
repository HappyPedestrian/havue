# 拖动缩放

## 示例

<script setup lang="ts">
import type { ChangeResultType } from '@/components/DragAndScale/DragAndScale.vue'
import { ref, computed } from 'vue'
import DragAndScale from '@/components/DragAndScale/DragAndScale.vue'
const containerRef = ref()

const dragPosition = ref({
  x: 50,
  y: 50,
  width: 100,
  height: 50
})

const containerRealSize = ref({ width: 1920, height: 1080 })

const dragStyle = computed(() => {
  return {
    top: `${dragPosition.value.y}px`,
    left: `${dragPosition.value.x}px`,
    width: `${dragPosition.value.width}px`,
    height: `${dragPosition.value.height}px`
  }
})

function handleChange(params: ChangeResultType) {
  Object.assign(dragPosition.value, {
    x: params.elX,
    y: params.elY,
    width: params.elWidth,
    height: params.elHeight
  })
  console.log(params)
}
</script>

<div class="drag-area" ref="containerRef">
  <DragAndScale
    :container="containerRef"
    :containerRealSize="containerRealSize"
    :keepRatio="{
      enable: true,
      scaleCase: 'min'
    }"
    :limit="{ minWidth: 64, minHeight: 64 }"
    :disabled="false"
    class="drag-box"
    @change="handleChange"
    :style="dragStyle"
  ></DragAndScale>
</div>

<style lang="scss">
.drag-area {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  background-color: rgb(71, 121, 105);
  .drag-box {
    position: absolute;
    background-color: rgb(26, 24, 24);
  }
}
</style>

::: code-group

```vue [template]
<template>
  <div class="drag-area" ref="containerRef">
    <DragAndScale
      :container="containerRef"
      :containerRealSize="containerRealSize"
      :keepRatio="{
        enable: true,
        scaleCase: 'min'
      }"
      :limit="{ minWidth: 64, minHeight: 64 }"
      :disabled="false"
      class="drag-box"
      @change="handleChange"
      :style="dragStyle"
    ></DragAndScale>
  </div>
</template>
```

```vue [script]
<script setup lang="ts">
import type { ChangeResultType } from '@/components/DragAndScale/DragAndScale.vue'
import { ref, computed } from 'vue'
import DragAndScale from '@/components/DragAndScale/DragAndScale.vue'
const containerRef = ref()

const dragPosition = ref({
  x: 50,
  y: 50,
  width: 100,
  height: 50
})

const containerRealSize = ref({ width: 1920, height: 1080 })

const dragStyle = computed(() => {
  return {
    top: `${dragPosition.value.y}px`,
    left: `${dragPosition.value.x}px`,
    width: `${dragPosition.value.width}px`,
    height: `${dragPosition.value.height}px`
  }
})

function handleChange(params: ChangeResultType) {
  Object.assign(dragPosition.value, {
    x: params.elX,
    y: params.elY,
    width: params.elWidth,
    height: params.elHeight
  })
  console.log(params)
}
</script>

```

```vue [style]
<style lang="scss" module>
.drag-area {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  background-color: rgb(71, 121, 105);
  .drag-box {
    position: absolute;
    background-color: rgb(26, 24, 24);
  }
}
</style>
```

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

|          事件            |        说明          |            参数类型                |
| :----------------        | :------------------ | :-------------------------------   |
| change                   | 拖动或者缩放时触发         | "{elX: number, elY: number, elW: number, elH: number, realX: numbere, realY: number, realW: number, realH: number}"    |
| finish                   | 拖动或者缩放结束时触发 | —                                 |
