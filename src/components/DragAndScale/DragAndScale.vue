<template>
  <div class="drag-and-scale-box" ref="targetRef">
    <slot></slot>
    <div class="zoom-mark-box">
      <div class="zoom-operate-box" :class="disabled ? 'disabled' : ''" ref="operateRef">
        <div class="top-box block">
          <div class="left-box" data-scale-side="left,top"></div>
          <div class="center-box" data-scale-side="top"></div>
          <div class="right-box" data-scale-side="right,top"></div>
        </div>
        <div class="middle-box block">
          <div class="left-box" data-scale-side="left"></div>
          <div class="center-box" data-scale-side="center"></div>
          <div class="right-box" data-scale-side="right"></div>
        </div>
        <div class="bottom-box block">
          <div class="left-box" data-scale-side="left,bottom"></div>
          <div class="center-box" data-scale-side="bottom"></div>
          <div class="right-box" data-scale-side="right,bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export type { ChangeResultType } from './hooks/useDragAndScale'
import type { ChangeResultType, UseDragAndScaleOptions } from './hooks/useDragAndScale'
</script>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDragAndScale } from './hooks/useDragAndScale'

const emits = defineEmits<{
  (name: 'change', params: ChangeResultType): void
  (name: 'finish'): void
}>()

const props = defineProps<{
  container: UseDragAndScaleOptions['container']
  containerRealSize?: UseDragAndScaleOptions['containerRealSize']
  keepRatio?: UseDragAndScaleOptions['keepRatio']
  limit?: UseDragAndScaleOptions['limit']
  disabled?: UseDragAndScaleOptions['disabled']
}>()

const targetRef = ref()
const operateRef = ref()

function onChange(params: ChangeResultType) {
  emits('change', params)
}

function onFinish() {
  emits('finish')
}

const useDragAndScaleOptions = computed<UseDragAndScaleOptions>(() => {
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

<style lang="scss" scoped>
.drag-and-scale-box {
  --drag-box-border-width: 1px;
  // 周围响应拖放操作区域宽度
  --scale-area-width: 30px;
  // 缩放标志与内容的距离
  --scale-mark-gap: 2px;
  // 缩放标志 边框的宽度
  --scale-mark-width: 3px;
  // 缩放边框图标区域inset
  --scale-mark-inset: calc(0px - (var(--scale-mark-width) + var(--scale-mark-gap) + var(--drag-box-border-width)));
  // 缩放边框图标 边框长度
  --scale-mark-line-width: calc(var(--scale-area-width) / 2);
  // 缩放操作区域inset
  --scale-area-inset: calc(0px - var(--scale-area-width) / 2 + var(--scale-mark-width) + var(--scale-mark-gap));
  position: relative;
  border: var(--drag-box-border-width) dashed #fff;
  box-sizing: border-box;
  .zoom-mark-box {
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

    .zoom-operate-box {
      position: absolute;
      inset: var(--scale-area-inset);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;

      &.disabled {
        .block {
          * {
            cursor: not-allowed !important;
          }
        }
      }

      .block {
        width: 100%;
        box-sizing: border-box;
        display: flex;

        .left-box,
        .right-box {
          box-sizing: border-box;
          width: var(--scale-area-width);
          height: var(--scale-area-width);
        }
        .center-box {
          flex: 1;
          height: var(--scale-area-width);
          box-sizing: border-box;
        }
      }

      .middle-box {
        flex: 1;
        .left-box,
        .right-box {
          height: 100%;
        }
        .center-box {
          flex: 1;
          height: 100%;
          cursor: move;
        }
      }

      .top-box .left-box,
      .bottom-box .right-box {
        cursor: nw-resize;
      }
      .top-box .right-box,
      .bottom-box .left-box {
        cursor: ne-resize;
      }
      .top-box,
      .bottom-box {
        .center-box {
          cursor: ns-resize;
        }
      }
      .middle-box {
        .left-box,
        .right-box {
          cursor: ew-resize;
        }
      }
      .top-box,
      .bottom-box {
        height: var(--scale-area-width);
      }
    }
  }
}
</style>
