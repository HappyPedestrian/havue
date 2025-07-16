<template>
  <div class="hv-color-picker-normal">
    <ColorArea
      ref="colorAreaRef"
      :hue-color="hueColor"
      :color="color"
      v-model:saturation="saturationv"
      v-model:value="value"
      :disabled="props.disabled"
    ></ColorArea>
    <div class="hv-color-picker__color-select-box">
      <svg
        v-if="isSupportEyeDropper"
        @click="handleOpenEyeDropper"
        class="hv-color-picker__dropper"
        :class="props.disabled ? 'is-disabled' : ''"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.9297 5.8C21.863 4.73333 20.263 4.73333 19.1964 5.8L15.463 9.53332L14.3963 8.59999C13.863 8.06666 13.063 8.06666 12.5296 8.59999C11.9963 9.13332 11.9963 9.93332 12.5296 10.4667L13.463 11.4L5.72967 19.1333C5.19634 19.6666 4.39634 21.6666 5.72967 23C7.06299 24.3333 9.06299 23.5333 9.59632 23L17.3296 15.2666L18.263 16.2C18.7964 16.7333 19.5964 16.7333 20.1297 16.2C20.663 15.6666 20.663 14.8666 20.1297 14.3333L19.1964 13.4L22.9297 9.66666C23.9964 8.46666 23.9964 6.86666 22.9297 5.8ZM8.39632 21.6666H7.06299V20.3333L14.7963 12.6L16.1296 13.9333C15.9963 13.9333 8.39632 21.6666 8.39632 21.6666Z"
          fill="currentcolor"
        />
      </svg>

      <div class="hv-color-picker__sliders">
        <ElSlider
          v-model="hue"
          :min="0"
          :max="360"
          :disabled="props.disabled"
          :show-tooltip="false"
          class="hv-color-picker__hue-slider"
          :style="{
            '--el-slider-button-bg-color': hueColor
          }"
        ></ElSlider>
        <ElSlider
          v-if="props.enableAlpha"
          v-model="alpha"
          :min="0"
          :max="100"
          :disabled="props.disabled"
          :show-tooltip="false"
          class="hv-color-picker__alpha-slider"
          :style="{
            '--hv-cur-full-alpha-color': fullAlphaColor
          }"
        ></ElSlider>
      </div>
    </div>
    <ColorForm v-model:model-value="color" :disabled="props.disabled" :enable-alpha="props.enableAlpha"></ColorForm>
    <PresetColors
      @change="handleColorChange"
      :title="props.presetTitle"
      :presetColors="props.presetColors"
    ></PresetColors>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Color from 'color'
import ColorArea from './children/ColorArea/ColorArea.vue'
import ColorForm from './children/ColorForm/ColorForm.vue'
import PresetColors from './children/PresetColors/PresetColors.vue'
import throttle from 'lodash/throttle'
import { DEFAULT_COLOR } from '../constants/index'

defineOptions({
  name: 'HvColorPickerNormal'
})

const emits = defineEmits<{
  (name: 'update:model-value', value: string): void
}>()

const props = withDefaults(
  defineProps<{
    modelValue: string
    disabled?: boolean
    enableAlpha?: boolean
    presetTitle?: string
    presetColors?: string[]
  }>(),
  {
    modelValue: DEFAULT_COLOR,
    enableAlpha: true
  }
)

// const color = defineModel<string>('color', {
//   default: DEFAULT_COLOR
// })

const color = computed({
  get() {
    return props.modelValue
  },
  set(value: string) {
    emits('update:model-value', value)
  }
})

const isSupportEyeDropper = !!(window as any).EyeDropper

const colorAreaRef = ref<InstanceType<typeof ColorArea>>()

/** 色相 */
const hue = ref(0)
const alpha = ref(0)
/** 饱和度 */
const saturationv = ref(100)
/** 明度 */
const value = ref(100)

const fullAlphaColor = computed(() => {
  return Color(color.value).alpha(1).hex()
})

watch(
  color,
  (c) => {
    const color = Color(c)
    const { h, s } = color.hsv().object()
    saturationv.value = s
    const equlValues = [0, 360]
    alpha.value = props.enableAlpha ? Math.round(color.alpha() * 100) : 100
    const curColor = Color.hsv({ h: hue.value, s: saturationv.value, v: value.value, alpha: alpha.value }).hexa()
    if (curColor !== color.hexa()) {
      if (!(equlValues.includes(h) && equlValues.includes(hue.value))) {
        hue.value = h
      }
    }
  },
  {
    immediate: true
  }
)

const hueColor = computed(() => {
  const color = Color({ h: hue.value, s: 100, v: 100 })
  return color.hex()
})

watch([hue, alpha, saturationv, value], () => {
  reCompColor()
})

const reCompColor = throttle(
  function reCompColor() {
    const newColor = Color({ h: hue.value, s: saturationv.value, v: value.value, alpha: alpha.value / 100 })

    color.value = newColor.hexa()
  },
  50,
  {
    leading: false,
    trailing: true
  }
)

function handleOpenEyeDropper() {
  if (props.disabled) {
    return
  }
  const eyeDropper = new (window as any).EyeDropper()

  eyeDropper
    .open()
    .then((result) => {
      color.value = result.sRGBHex
    })
    .catch((e) => {
      console.error('Eyedropper failed to get color', e)
    })
}

function handleColorChange(hex: string) {
  if (props.disabled) {
    return
  }
  color.value = hex
}
</script>

<style lang="scss" scoped>
.hv-color-picker-normal {
  box-sizing: border-box;
  width: 248px;
  padding: 16px;
  overflow: hidden;
  background-color: #22252a;

  .hv-color-picker__color-select-box {
    display: flex;
    gap: 14px;
    align-items: center;
    margin-top: 6px;

    .hv-color-picker__dropper {
      width: 28px;
      height: 28px;
      color: #cad1e0;
      cursor: pointer;
      border-radius: 4px;

      &.is-disabled {
        cursor: not-allowed;
      }

      &:hover {
        background-color: #3c4452;
      }

      &:active {
        color: #0977e5;
        background-color: #0977e533;
      }
    }

    .hv-color-picker__sliders {
      flex: 1;

      :deep(.el-slider) {
        height: 24px;

        .el-slider__runway {
          --el-slider-height: 12px;
          --el-slider-border-radius: 6px;
        }

        .el-slider__bar {
          opacity: 0;
        }

        .el-slider__button-wrapper {
          top: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);

          --el-slider-button-wrapper-size: 20px;

          .el-slider__button {
            box-sizing: border-box;
            width: 14px;
            height: 14px;
            background-color: var(--el-slider-button-bg-color);
            border-color: #fff;
            border-width: 3px;
          }
        }
      }

      :deep(.hv-color-picker__hue-slider) {
        .el-slider__runway {
          background: linear-gradient(
            90deg,
            #f00 0%,
            #ff0 16.67%,
            #0f0 33.33%,
            #0ff 50%,
            #00f 66.67%,
            #f0f 83.33%,
            #f00 100%
          );
        }
      }

      :deep(.hv-color-picker__alpha-slider) {
        .el-slider__runway {
          --el-slider-main-bg-color: var(--hv-cur-full-alpha-color);
          --el-slider-button-bg-color: var(--hv-cur-full-alpha-color);

          background:
            linear-gradient(to right, transparent 0%, var(--el-slider-main-bg-color) 100%),
            linear-gradient(to right, #e1e1e1 0%, #e1e1e1 50%, #fff 50%, #fff 100%) 0 0 / 12px 50% repeat-x,
            linear-gradient(to right, #e1e1e1 0%, #e1e1e1 50%, #fff 50%, #fff 100%) 6px 6px / 12px 50% repeat-x;
        }
      }
    }
  }

  .mb-12 {
    margin-bottom: 12px;
  }
}
</style>
