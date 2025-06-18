<template>
  <div ref="colorAreaRef" class="hv-color-picker__color-area-outer">
    <div class="hv-color-picker__color-area" :style="{ backgroundColor: props.hueColor }">
      <div
        class="hv-color-picker__circle"
        :style="{
          backgroundColor: state.hexColor,
          left: `${circlePickerCoordinate.x}%`,
          bottom: `${circlePickerCoordinate.y}%`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import Color from 'color'
import { useInteraction } from './hooks/useInteraction'

interface StateType {
  hexColor: string
  bgHexColor: string
}

const emits = defineEmits<{
  (name: 'update:saturation', value: number): void
  (name: 'update:value', value: number): void
}>()

const props = withDefaults(
  defineProps<{
    saturation: number
    value: number
    color: string
    hueColor: string
    disabled?: boolean
  }>(),
  {
    saturation: 100,
    value: 100
  }
)

// const saturationv = defineModel<number>('saturation', {
//   default: 100
// })

// const value = defineModel<number>('value', {
//   default: 100
// })

const saturationv = computed<number>({
  get() {
    return props.saturation
  },
  set(value: number) {
    emits('update:saturation', value)
  }
})

const value = computed<number>({
  get() {
    return props.value
  },
  set(value: number) {
    emits('update:value', value)
  }
})

const isDisabled = computed(() => {
  return props.disabled
})

const { colorAreaRef, circlePickerCoordinate, setCirclePickerCoordinate } = useInteraction(isDisabled)

const state = reactive<StateType>({
  hexColor: '',
  bgHexColor: ''
})

watch(
  () => props.color,
  (c) => {
    const color = Color(c)
    state.hexColor = color.hex()
    let { h, s, v } = color.hsv().object()
    state.bgHexColor = Color({ h, s: 100, v: 100 }).hex()
    const curColor = Color.hsv({ h, s: circlePickerCoordinate.x, v: circlePickerCoordinate.y }).hex()
    if (curColor == color.hex()) {
      // 黑色在底部不更改位置
      s = circlePickerCoordinate.x
    }
    setCirclePickerCoordinate(s, v)
  },
  {
    immediate: true
  }
)

watch(
  circlePickerCoordinate,
  (val) => {
    saturationv.value = val.x
    value.value = val.y
  },
  {
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.hv-color-picker__color-area-outer {
  position: relative;
  width: 216px;
  height: 216px;

  .hv-color-picker__color-area {
    width: 100%;
    height: 100%;

    // white
    &::before {
      position: absolute;
      right: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      content: '';
      background: linear-gradient(to right, #fff 1px, transparent 215px);
    }

    // black
    &::after {
      position: absolute;
      right: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      content: '';
      background: linear-gradient(to bottom, transparent 1px, #000 215px);
    }

    .hv-color-picker__circle {
      position: absolute;
      z-index: 1;
      box-sizing: border-box;
      width: 12px;
      height: 12px;
      pointer-events: none;
      border: 2px solid #fff;
      border-radius: 100%;
      box-shadow: 0 0 0 1px #0003;
      transform: translate(-50%, 50%);
    }
  }
}
</style>
