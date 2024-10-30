<template>
  <div class="drag-and-scale-box" ref="targetRef">
    <slot></slot>
    <div class="zoom-mark-box">
      <div class="zoom-operate-box" ref="operateRef"></div>
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
  position: relative;
  border: 1px dashed #fff;
  box-sizing: border-box;
  .zoom-mark-box {
    position: absolute;
    inset: -5px;
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
      15px 3px,
      15px 3px,
      15px 3px,
      15px 3px,
      15px 3px,
      15px 3px,
      3px 15px,
      3px 15px,
      3px 15px,
      3px 15px,
      3px 15px,
      3px 15px;

    .zoom-operate-box {
      position: absolute;
      inset: -10px;
    }
  }
}
</style>
