<template>
  <div ref="dragItemRef" class="hv-draggable" :class="disabled ? 'disabled' : ''">
    <slot></slot>
    <div class="hv-draggable__clone-item" :style="cloneNodeStyle" v-if="isDragThis">
      <slot name="hv-drag-item"><slot></slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { DnDManagerEvents, DragAndDropDragType, DragAndDropPoint } from './manager'

import { DnDManagerInstance } from './manager'

defineOptions({
  name: 'HvDraggable'
})

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
    type: DragAndDropDragType
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

const onDown: DnDManagerEvents['down'] = (params) => {
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
}

const onFirstMove: DnDManagerEvents['first-move'] = (params, event) => {
  const { x, y } = params
  const directions = immediateDirections.value.filter((item) => item !== ImmediateEnumType.ALL)

  if (isDownThis.value && !props.disabled && directions.length) {
    const distanceH = x - downPosition.x
    const distanceHAbs = Math.abs(distanceH)
    const distanceV = y - downPosition.y
    const distanceVAbs = Math.abs(distanceV)

    const max = Math.max(distanceHAbs, distanceVAbs)

    const isMaxH = distanceHAbs === max
    const isMaxV = distanceVAbs === max

    /** 是否立即响应拖动 */
    let isImmediate = false

    if (isMaxH) {
      isImmediate =
        (directions.includes(ImmediateEnumType.LEFT) && distanceH < 0) ||
        (directions.includes(ImmediateEnumType.RIGHT) && distanceH > 0)
    }

    if (isMaxV && !isImmediate) {
      isImmediate =
        (directions.includes(ImmediateEnumType.TOP) && distanceV < 0) ||
        (directions.includes(ImmediateEnumType.BOTTOM) && distanceV > 0)
    }

    if (isImmediate) {
      event.preventDefault()
      event.stopPropagation()
      handleStart(downPosition)
      handleMove(params)
      return
    }
  }
}

const onStart: DnDManagerEvents['start'] = (params) => {
  const { x, y } = params
  const startEl = document.elementFromPoint(x, y)
  if (!props.disabled && dragItemRef.value && dragItemRef.value.contains(startEl)) {
    handleStart(params)
  }
}

const onMove: DnDManagerEvents['move'] = (params) => {
  const { point } = params
  if (isDragThis.value) {
    handleMove(point)
  }
}

const onEnd: DnDManagerEvents['end'] = () => {
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
}

function handleStart(point: DragAndDropPoint) {
  isDragThis.value = true
  cloneNodePosition.x = point.x
  cloneNodePosition.y = point.y
  DnDManagerInstance.updateDargInfo(props.type, props.data)
}

function handleMove(point: DragAndDropPoint) {
  cloneNodePosition.x = point.x
  cloneNodePosition.y = point.y
}

onMounted(() => {
  DnDManagerInstance.on('down', onDown)
  DnDManagerInstance.on('first-move', onFirstMove)
  DnDManagerInstance.on('start', onStart)
  DnDManagerInstance.on('move', onMove)
  DnDManagerInstance.on('end', onEnd)
})

onBeforeUnmount(() => {
  DnDManagerInstance.off('down', onDown)
  DnDManagerInstance.off('first-move', onFirstMove)
  DnDManagerInstance.off('start', onStart)
  DnDManagerInstance.off('move', onMove)
  DnDManagerInstance.off('end', onEnd)
})
</script>

<style lang="scss" scoped>
.hv-draggable {
  width: fit-content;
  cursor: grab;

  &.disabled {
    cursor: not-allowed;
  }
}

.hv-draggable__clone-item {
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
