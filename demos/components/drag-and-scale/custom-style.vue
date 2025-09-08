// #region template
<template>
  <div class="custom-drag-area" ref="containerRef">
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
        <div>inContainer: true</div>
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
  width: 150,
  height: 80
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

function handleChange(params: DragAndScaleChangeResultType) {
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
<!--  -->
// #region style
<style lang="scss" scoped>
.custom-drag-area {
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

  :deep(.hv-drag-and-scale) {
    --hv-dns-mark-inset: -5px;

    background:
      linear-gradient(to right, #0977e5 50%, transparent 50%) 0 0 / 16px 1px repeat-x,
      linear-gradient(to right, #0977e5 50%, transparent 50%) bottom / 16px 1px repeat-x,
      linear-gradient(to bottom, #0977e5 50%, transparent 50%) 0 0 / 1px 16px repeat-y,
      linear-gradient(to bottom, #0977e5 50%, transparent 50%) right / 1px 16px repeat-y,
      rgb(26 24 24);
    border: none;

    .hv-drag-and-scale__zoom-mark {
      background: none;

      .hv-drag-and-scale__area-box {
        .hv-drag-and-scale__area-top div,
        .hv-drag-and-scale__area-bottom div,
        .hv-drag-and-scale__area-middle .left-box,
        .hv-drag-and-scale__area-middle .right-box {
          display: flex;
          align-items: center;
          justify-content: center;

          &::after {
            box-sizing: border-box;
            display: inline-block;
            width: 10px;
            height: 10px;
            content: '';
            background-color: #0977e5;
            border: 1px solid #fff;
          }
        }
      }
    }
  }
}
</style>
// #endregion style
