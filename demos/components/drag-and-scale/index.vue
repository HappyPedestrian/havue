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
    >
      <div class="inner-box">
        <div>min: 64*64</div>
        <div>keepRatio: true</div>
        <div>inContaienr: true</div>
      </div>
    </DragAndScale>
    <DragAndScale
      :container="containerRef"
      :containerRealSize="containerRealSize"
      :keepRatio="{
        enable: false,
        scaleCase: 'min'
      }"
      :limit="{ inContainer: false, minWidth: 128, minHeight: 128, maxWidth: 512, maxHeight: 300 }"
      :disabled="false"
      class="drag-box"
      @change="handleChange2"
      :style="dragStyle2"
    >
      <div class="inner-box">
        <div>min: 128*128</div>
        <div>max: 512*300</div>
        <div>keepRatio: false</div>
        <div>inContaienr: false</div>
      </div>
    </DragAndScale>
  </div>
</template>
// #endregion template
<!--  -->
// #region script
<script setup lang="ts">
import type { DragAndScaleChangeResultType } from '@havue/drag-and-scale'
import { ref, computed } from 'vue'
// import { HvDragAndScale as DragAndScale } from '@havue/drag-and-scale'
import { HvDragAndScale as DragAndScale } from '@havue/components'
const containerRef = ref()

const dragPosition = ref({
  x: 50,
  y: 50,
  width: 100,
  height: 50
})

const dragPosition2 = ref({
  x: 230,
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

const dragStyle2 = computed(() => {
  return {
    top: `${dragPosition2.value.y}px`,
    left: `${dragPosition2.value.x}px`,
    width: `${dragPosition2.value.width}px`,
    height: `${dragPosition2.value.height}px`,
    background: 'gray'
  }
})

function handleChange(params: DragAndScaleChangeResultType) {
  Object.assign(dragPosition.value, {
    x: params.elX,
    y: params.elY,
    width: params.elWidth,
    height: params.elHeight
  })
  console.log(params)
}

function handleChange2(params: DragAndScaleChangeResultType) {
  Object.assign(dragPosition2.value, {
    x: params.elX,
    y: params.elY,
    width: params.elWidth,
    height: params.elHeight
  })
  console.log(params)
}
</script>
// #endregion script
<!--  -->
// #region style
<style lang="scss" scoped>
.drag-area {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background-color: rgb(71 121 105);

  .drag-box {
    position: absolute;
    background-color: rgb(26 24 24);

    .inner-box {
      width: 100%;
      height: 100%;
      overflow: hidden;
      white-space: nowrap;
      user-select: none;
    }
  }
}
</style>
// #endregion style
