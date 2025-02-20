<template>
  <div ref="dragItemRef" class="draggable-area" :class="disabled ? 'disabled' : ''">
    <slot></slot>
    <div class="draggable-clone-item" :style="cloneNodeStyle" v-if="isDragThis">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { DragType, Point } from './manager'

import { DnDManagerInstance } from './manager'

const ImmediateEnumType = {
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
  ALL: 'all'
} as const

type ImmediateType = (typeof ImmediateEnumType)[keyof typeof ImmediateEnumType]

const props = withDefaults(
  defineProps<{
    type: DragType
    immediate?: ImmediateType | Array<ImmediateType> | undefined
    disabled?: boolean
    data?: any
  }>(),
  {
    disabled: false
  }
)

const dragItemRef = ref<HTMLElement>()
/** 是否在当前组件按下 */
const isDownThis = ref(false)
/** 开始按下时的点 */
const downPosition = reactive({
  x: 0,
  y: 0
})
/** 是否开始拖动 */
const isDragThis = ref(false)
const cloneNodePosition = reactive({
  x: 0,
  y: 0
})

const immediateDirections = computed<Array<ImmediateType>>(() => {
  if (Array.isArray(props.immediate)) {
    return props.immediate
  }
  return props.immediate ? [props.immediate] : []
})

const cloneNodeStyle = computed(() => {
  return {
    transform: `translate(${cloneNodePosition.x}px, ${cloneNodePosition.y}px) translate(-50%, -50%)`
  }
})

DnDManagerInstance.on('down', (params) => {
  const { x, y } = params
  const startEl = document.elementFromPoint(x, y)
  if (!props.disabled && dragItemRef.value && dragItemRef.value.contains(startEl)) {
    if (immediateDirections.value.includes(ImmediateEnumType.ALL)) {
      handleStart(params)
      return
    }
    isDownThis.value = true
    downPosition.x = x
    downPosition.y = y
  }
})

DnDManagerInstance.on('first-move', (params, event) => {
  const { x, y } = params
  if (isDownThis.value && !props.disabled) {
    const distanceH = x - downPosition.x
    const distanceHAbs = Math.abs(distanceH)
    const distanceV = y - downPosition.y
    const distanceVAbs = Math.abs(distanceV)

    const max = Math.max(distanceHAbs, distanceVAbs)

    const isMaxH = distanceHAbs === max
    const isMaxV = distanceVAbs === max

    const directions = immediateDirections.value
    const isLeft = directions.includes(ImmediateEnumType.LEFT) && isMaxH && distanceH < 0
    const isRight = directions.includes(ImmediateEnumType.RIGHT) && isMaxH && distanceH > 0
    const isTop = directions.includes(ImmediateEnumType.TOP) && isMaxV && distanceV < 0
    const isBottom = directions.includes(ImmediateEnumType.BOTTOM) && isMaxV && distanceV > 0
    if (isLeft || isRight || isTop || isBottom) {
      event.preventDefault()
      event.stopPropagation()
      handleStart(downPosition)
      handleMove(params)
      return
    }
  }
})

DnDManagerInstance.on('start', (params) => {
  const { x, y } = params
  const startEl = document.elementFromPoint(x, y)
  if (!props.disabled && dragItemRef.value && dragItemRef.value.contains(startEl)) {
    handleStart(params)
  }
})

DnDManagerInstance.on('move', (params) => {
  const { point } = params
  if (isDragThis.value) {
    handleMove(point)
  }
})

DnDManagerInstance.on('end', () => {
  isDownThis.value = false
  isDragThis.value = false
  Object.assign(downPosition, {
    x: 0,
    y: 0
  })
  Object.assign(cloneNodePosition, {
    x: 0,
    y: 0
  })
})

function handleStart(point: Point) {
  isDragThis.value = true
  cloneNodePosition.x = point.x
  cloneNodePosition.y = point.y
  DnDManagerInstance.updateDargInfo(props.type, props.data)
}

function handleMove(point: Point) {
  cloneNodePosition.x = point.x
  cloneNodePosition.y = point.y
}
</script>

<style lang="scss" scoped>
.draggable-area {
  width: fit-content;
  cursor: grab;

  &.disabled {
    cursor: not-allowed;
  }
}

.draggable-clone-item {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  width: fit-content;
  cursor: grabbing;
  opacity: 0.8;
  will-change: transform;
}
</style>
