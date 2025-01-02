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
import type { DragType } from './manager'

import { DnDManagerInstance } from './manager'

const props = withDefaults(
  defineProps<{
    type: DragType
    disabled?: boolean
    data?: any
  }>(),
  {
    disabled: false
  }
)

const dragItemRef = ref<HTMLElement>()
const isDragThis = ref(false)
const cloneNodePosition = reactive({
  x: 0,
  y: 0
})

const cloneNodeStyle = computed(() => {
  return {
    transform: `translate(${cloneNodePosition.x}px, ${cloneNodePosition.y}px) translate(-50%, -50%)`
  }
})

DnDManagerInstance.on('start', (params) => {
  const { x, y } = params
  const startEl = document.elementFromPoint(x, y)
  if (!props.disabled && dragItemRef.value && dragItemRef.value.contains(startEl)) {
    isDragThis.value = true
    cloneNodePosition.x = params.x
    cloneNodePosition.y = params.y
    DnDManagerInstance.updateDargInfo(props.type, props.data)
  }
})

DnDManagerInstance.on('move', (params) => {
  const { point } = params
  if (isDragThis.value) {
    cloneNodePosition.x = point.x
    cloneNodePosition.y = point.y
  }
})

DnDManagerInstance.on('end', () => {
  isDragThis.value = false
  Object.assign(cloneNodePosition, {
    x: 0,
    y: 0
  })
})
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
  z-index: 99999;
  top: 0;
  left: 0;
  width: fit-content;
  opacity: 0.8;
  cursor: grabbing;
  will-change: transform;
}
</style>
