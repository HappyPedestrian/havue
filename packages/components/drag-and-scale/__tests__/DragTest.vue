<template>
  <div ref="containerRef" class="container">
    <HvDragAndScale
      :container="containerRef"
      :limit="{
        inContainer: props.limitInContainer
      }"
      :style="dragStyle"
      @change="handleChange"
      class="drag-box"
    ></HvDragAndScale>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HvDragAndScale, DragAndScaleChangeResultType } from '@havue/drag-and-scale'

const props = withDefaults(
  defineProps<{
    limitInContainer?: boolean
  }>(),
  {
    limitInContainer: true
  }
)

const containerRef = ref()

const dragStyle = ref<{
  left: string
  top: string
  width: string
  height: string
}>({
  left: '50px',
  top: '50px',
  width: '100px',
  height: '100px'
})

function handleChange(params: DragAndScaleChangeResultType) {
  const { elX, elY, elWidth, elHeight } = params
  dragStyle.value = {
    ...dragStyle.value,
    left: elX + 'px',
    top: elY + 'px',
    width: elWidth + 'px',
    height: elHeight + 'px'
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 600px;
  height: 600px;
  background: gray;

  .drag-box {
    position: absolute;
    background-color: red;
  }
}
</style>
