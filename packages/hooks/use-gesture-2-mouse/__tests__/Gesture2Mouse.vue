<template>
  <div class="container">
    <div ref="boxRef1" class="box box1"></div>
    <div ref="boxRef2" class="box box2"></div>
  </div>
</template>

<script setup lang="ts">
import type { UseGestrue2MouseTargetPositionType, UseGestrue2MouseMouseButtonType } from '@havue/use-gesture-2-mouse'

import { ref } from 'vue'
import { useGestrue2Mouse } from '@havue/use-gesture-2-mouse'

const emits = defineEmits<{
  (e: 'click', position: UseGestrue2MouseTargetPositionType, button?: UseGestrue2MouseMouseButtonType): void
  (e: 'wheel', position: UseGestrue2MouseTargetPositionType, delta: number): void
}>()

const boxRef1 = ref<HTMLElement | undefined>(undefined)
const boxRef2 = ref<HTMLElement | undefined>(undefined)

useGestrue2Mouse(boxRef1, {
  onMouseEvent(p, button) {
    emits('click', p, button)
  },
  onMouseWheel(p, delta) {
    emits('wheel', p, delta)
  }
})

useGestrue2Mouse(boxRef2, {
  onMouseEvent(p, button) {
    emits('click', p, button)
  },
  onMouseWheel(p, delta) {
    emits('wheel', p, delta)
  },
  TargetRealSize: {
    width: 1000,
    height: 500
  },
  throttle: {
    wait: 50,
    leading: false,
    trailing: true
  }
})
</script>

<style lang="scss" scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: red;
}
</style>
