// #region template
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
// #endregion template
<empty></empty>
// #region script
<script setup lang="ts">
import type { ChangeResultType } from './DragAndScale.vue'
import { ref, computed } from 'vue'
import DragAndScale from './DragAndScale.vue'
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
// #endregion script
<empty></empty>
// #region style
<style lang="scss" scoped>
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
// #endregion style
