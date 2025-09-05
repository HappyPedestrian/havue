<template>
  <div class="hv-drag-and-scale" ref="targetRef">
    <slot></slot>
    <div class="hv-drag-and-scale__zoom-mark">
      <div class="hv-drag-and-scale__area-box" :class="props.disabled ? 'disabled' : ''" ref="operateRef">
        <div class="hv-drag-and-scale__area-top hv-drag-and-scale__area-block">
          <div class="hv-drag-and-scale__area-left" data-scale-side="left,top"></div>
          <div class="hv-drag-and-scale__area-center" data-scale-side="top"></div>
          <div class="hv-drag-and-scale__area-right" data-scale-side="right,top"></div>
        </div>
        <div class="hv-drag-and-scale__area-middle hv-drag-and-scale__area-block">
          <div class="hv-drag-and-scale__area-left" data-scale-side="left"></div>
          <div class="hv-drag-and-scale__area-center" data-scale-side="center"></div>
          <div class="hv-drag-and-scale__area-right" data-scale-side="right"></div>
        </div>
        <div class="hv-drag-and-scale__area-bottom hv-drag-and-scale__area-block">
          <div class="hv-drag-and-scale__area-left" data-scale-side="left,bottom"></div>
          <div class="hv-drag-and-scale__area-center" data-scale-side="bottom"></div>
          <div class="hv-drag-and-scale__area-right" data-scale-side="right,bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export type { DragAndScaleChangeResultType } from './hooks/useDragAndScale'
import type { DragAndScaleChangeResultType, DragAndScaleOptions } from './hooks/useDragAndScale'
</script>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDragAndScale } from './hooks/useDragAndScale'

defineOptions({
  name: 'HvDragAndScale'
})

const emits = defineEmits<{
  (name: 'change', params: DragAndScaleChangeResultType): void
  (name: 'finish'): void
}>()

const props = defineProps<{
  container: DragAndScaleOptions['container']
  containerRealSize?: DragAndScaleOptions['containerRealSize']
  keepRatio?: DragAndScaleOptions['keepRatio']
  limit?: DragAndScaleOptions['limit']
  disabled?: DragAndScaleOptions['disabled']
}>()

const targetRef = ref()
const operateRef = ref()

function onChange(params: DragAndScaleChangeResultType) {
  emits('change', params)
}

function onFinish() {
  emits('finish')
}

const useDragAndScaleOptions = computed<DragAndScaleOptions>(() => {
  return {
    container: props.container,
    containerRealSize: props.containerRealSize,
    keepRatio: props.keepRatio,
    limit: props.limit,
    disabled: props.disabled,
    onChange,
    onFinish
  }
})

useDragAndScale(targetRef, operateRef, useDragAndScaleOptions)
</script>

<style lang="scss">
.hv-drag-and-scale {
  --drag-box-border-width: 1px;

  // 周围响应拖放操作区域宽度
  // Width of the area around the response drag-and-drop operation
  --scale-area-width: 30px;

  // 缩放标志与内容的距离
  // Scale the distance of the logo from the content
  --scale-mark-gap: 2px;

  // 缩放标志 边框的宽度
  // Resize the width of the flag border
  --scale-mark-width: 3px;

  // 缩放边框图标区域inset
  // Resize the border icon area inset
  --scale-mark-inset: calc(0px - (var(--scale-mark-width) + var(--scale-mark-gap) + var(--drag-box-border-width)));

  // 缩放边框图标 边框长度
  // Resize the border icon border length
  --scale-mark-line-width: calc(var(--scale-area-width) / 2);

  // 缩放操作区域inset
  // Zoom the operation area inset
  --scale-area-inset: calc(0px - var(--scale-area-width) / 2 + var(--scale-mark-width) + var(--scale-mark-gap));

  position: relative;
  box-sizing: border-box;
  border: var(--drag-box-border-width) dashed #fff;

  .hv-drag-and-scale__zoom-mark {
    position: absolute;
    inset: var(--scale-mark-inset);
    background:
      linear-gradient(to right, #fff, #fff) left top no-repeat,
      linear-gradient(to right, #fff, #fff) right top no-repeat,
      linear-gradient(to right, #fff, #fff) center top no-repeat,
      linear-gradient(to right, #fff, #fff) left bottom no-repeat,
      linear-gradient(to right, #fff, #fff) right bottom no-repeat,
      linear-gradient(to right, #fff, #fff) center bottom no-repeat,
      linear-gradient(to bottom, #fff, #fff) left top no-repeat,
      linear-gradient(to bottom, #fff, #fff) left bottom no-repeat,
      linear-gradient(to bottom, #fff, #fff) left center no-repeat,
      linear-gradient(to bottom, #fff, #fff) right top no-repeat,
      linear-gradient(to bottom, #fff, #fff) right bottom no-repeat,
      linear-gradient(to bottom, #fff, #fff) right center no-repeat;
    background-size:
      var(--scale-mark-line-width) var(--scale-mark-width),
      var(--scale-mark-line-width) var(--scale-mark-width),
      var(--scale-mark-line-width) var(--scale-mark-width),
      var(--scale-mark-line-width) var(--scale-mark-width),
      var(--scale-mark-line-width) var(--scale-mark-width),
      var(--scale-mark-line-width) var(--scale-mark-width),
      var(--scale-mark-width) var(--scale-mark-line-width),
      var(--scale-mark-width) var(--scale-mark-line-width),
      var(--scale-mark-width) var(--scale-mark-line-width),
      var(--scale-mark-width) var(--scale-mark-line-width),
      var(--scale-mark-width) var(--scale-mark-line-width),
      var(--scale-mark-width) var(--scale-mark-line-width);

    .hv-drag-and-scale__area-box {
      position: absolute;
      inset: var(--scale-area-inset);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .hv-drag-and-scale__area-block {
        box-sizing: border-box;
        display: flex;
        width: 100%;

        .hv-drag-and-scale__area-left,
        .hv-drag-and-scale__area-right {
          box-sizing: border-box;
          width: var(--scale-area-width);
          max-width: 33.3333%;
          height: 100%;
        }

        .hv-drag-and-scale__area-center {
          box-sizing: border-box;
          flex: 1;
          height: 100%;
        }
      }

      &.disabled {
        .hv-drag-and-scale__area-block {
          * {
            cursor: not-allowed !important;
          }
        }
      }

      .hv-drag-and-scale__area-middle {
        flex: 1;

        .hv-drag-and-scale__area-left,
        .hv-drag-and-scale__area-right {
          height: 100%;
          cursor: ew-resize;
        }

        .hv-drag-and-scale__area-center {
          flex: 1;
          height: 100%;
          cursor: move;
        }
      }

      .hv-drag-and-scale__area-top .hv-drag-and-scale__area-left,
      .hv-drag-and-scale__area-bottom .hv-drag-and-scale__area-right {
        cursor: nw-resize;
      }

      .hv-drag-and-scale__area-top .hv-drag-and-scale__area-right,
      .hv-drag-and-scale__area-bottom .hv-drag-and-scale__area-left {
        cursor: ne-resize;
      }

      .hv-drag-and-scale__area-top,
      .hv-drag-and-scale__area-bottom {
        box-sizing: border-box;
        height: var(--scale-area-width);
        max-height: 33.3333%;

        .hv-drag-and-scale__area-center {
          cursor: ns-resize;
        }
      }
    }
  }
}
</style>
