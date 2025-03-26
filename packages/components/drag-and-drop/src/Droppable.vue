<template>
  <div ref="dropAreaRef" class="droppable-area">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import type { DragAndDropDragType, DragAndDropPoint } from './manager'
import { computed, ref } from 'vue'
import { DnDManagerInstance } from './manager'

defineOptions({
  name: 'PdDroppable'
})

const emits = defineEmits<{
  (name: 'enter', type: DragAndDropDragType, point: DragAndDropPoint, data: any): void
  (name: 'move', type: DragAndDropDragType, point: DragAndDropPoint, data: any): void
  (name: 'drop', type: DragAndDropDragType, point: DragAndDropPoint, data: any): void
  (name: 'leave', type: DragAndDropDragType, data: any): void
}>()

const props = defineProps<{
  acceptDragType: DragAndDropDragType | Array<DragAndDropDragType>
}>()

const dropAreaRef = ref<HTMLElement>()
const isEntered = ref(false)

const acceptDragTypeList = computed(() => {
  return Array.isArray(props.acceptDragType) ? props.acceptDragType : [props.acceptDragType]
})

function getPositionInArea(point: DragAndDropPoint) {
  if (!dropAreaRef.value) {
    return {
      isInArea: false,
      position: {
        x: 0,
        y: 0
      }
    }
  }
  const { x: pointX, y: pointY } = point
  const { x, y, width, height } = dropAreaRef.value.getBoundingClientRect()

  const posX = pointX - x
  const posY = pointY - y
  return {
    isInArea: posX >= 0 && posX <= width && posY >= 0 && posY <= height,
    position: {
      x: posX,
      y: posY
    }
  }
}

DnDManagerInstance.on('move', (params) => {
  const { type, data, point } = params
  if (dropAreaRef.value && acceptDragTypeList.value.includes(type)) {
    const { isInArea, position } = getPositionInArea(point)
    if (isInArea) {
      if (isEntered.value) {
        emits('move', type, position, data)
      } else {
        isEntered.value = true
        emits('enter', type, position, data)
      }
    } else if (isEntered.value) {
      isEntered.value = false
      emits('leave', type, data)
    }
  }
})

DnDManagerInstance.on('end', ({ type, point, data }) => {
  if (dropAreaRef.value && acceptDragTypeList.value.includes(type) && isEntered.value) {
    const { position } = getPositionInArea(point)
    emits('drop', type, position, data)
  }
})
</script>

<style lang="scss" scoped>
.droppable-area {
  position: relative;
  width: fit-content;
}
</style>
