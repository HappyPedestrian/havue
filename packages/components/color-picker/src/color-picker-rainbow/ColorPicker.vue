<template>
  <div class="hv-color-picker">
    <div class="hv-color-picker__title">{{ props.title || 'Color picker' }}</div>
    <div class="hv-color-picker__area-outer">
      <div class="hv-color-picker__area" :class="isDisabled ? 'is-disabled' : ''" ref="colorAreaRef">
        <canvas ref="colorAreaCanvas"></canvas>
        <div class="hv-color-picker__circle" :style="cilcleStyle"></div>
      </div>
    </div>

    <div class="hv-color-picker__slider">
      <ElSlider
        v-model="colorDepth"
        :disabled="props.disabled"
        :min="0"
        :max="100"
        :show-tooltip="false"
        :style="sliderBackStyle"
      ></ElSlider>
      <div class="hv-color-picker__origin-color" :style="{ backgroundColor: originHexColor }"></div>
    </div>
    <ColorForm :model-value="color" :disabled="props.disabled" @change="handleColorChange"></ColorForm>
    <PresetColors
      @change="handleColorChange"
      :title="props.presetTitle"
      :presetColors="props.presetColors"
    ></PresetColors>
  </div>
</template>

<script setup lang="ts">
import type ColorConstruct from 'color'
import { ref, computed, watch, onMounted } from 'vue'
import Color from 'color'
import { useColorArea } from './hooks/useColorArea'
import { useOperateEvent } from './hooks/useOperateEvent'
import { getLightColorAndDepth, hexToColor, getOriginHexByLightAndDepth, colorToHex } from './utils/color'
import ColorForm from './children/ColorForm/ColorForm.vue'
import PresetColors from './children/PresetColors/PresetColors.vue'
import { DEFAULT_COLOR } from '../constants/index'

defineOptions({
  name: 'HvColorPicker'
})

const props = withDefaults(
  defineProps<{
    modelValue: string
    disabled?: boolean
    title?: string
    presetTitle?: string
    presetColors?: string[]
  }>(),
  {
    modelValue: DEFAULT_COLOR
  }
)

const emits = defineEmits<{
  (name: 'update:model-value', value: string): void
}>()

const isDisabled = computed(() => props.disabled)

const { colorAreaCanvas, getColorByCoordinate, getCoordinateByColor, canvasWidth, canvasHeight } = useColorArea()
const { colorAreaRef, circlePickerCoordinate, setCirclePickerCoordinate } = useOperateEvent({ disabled: isDisabled })

// const color = ref<string>('#ffccaa')
// const color = defineModel({
//   type: String,
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

/** 在canvas颜色区域中的颜色(明度为100) | The color in the canvas color area (Value = 100) */
const lightColor = ref<ColorConstruct>(Color(DEFAULT_COLOR))
/** hsv 明度 | hsv Value */
const colorDepth = ref(100)

/** 根据 lightColor 以及 colorDepth 计算出的实际显示16进制颜色值 | The actual displayed hexadecimal color value calculated from lightColor and colorDepth */
const originHexColor = computed(() => {
  if (lightColor.value) {
    const hex = getOriginHexByLightAndDepth(lightColor.value, colorDepth.value)
    return hex
  }
  return DEFAULT_COLOR
})

// 颜色值更改，更新当前颜色位置 | The color value changes, updating the current color position
watch(color, (val) => {
  const hex = getOriginHexByLightAndDepth(lightColor.value, colorDepth.value)
  if (hex === val) {
    return
  }
  handleColorChange(val)
})

// 当颜色位置更改时，计算新的颜色值 | When the color position changes, the new color value is calculated
watch(
  () => circlePickerCoordinate,
  (coordianate) => {
    const rect = colorAreaRef.value?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const color = getColorByCoordinate(coordianate.x, coordianate.y, rect.width, rect.height)
    lightColor.value = color
  },
  {
    deep: true
  }
)

// 当前颜色圆形图标位置样式 | Current color circular icon position and style
const cilcleStyle = computed(() => {
  if (!color.value) {
    return {
      top: '100%',
      left: '0',
      backgroundColor: '#ffffff'
    }
  }
  return {
    top: circlePickerCoordinate.y + 'px',
    left: circlePickerCoordinate.x + 'px',
    backgroundColor: lightColor.value.hex()
  }
})

// 颜色明暗度slider背景颜色 | Color Lightness slider background color
const sliderBackStyle = computed(() => {
  const lightHex = colorToHex(lightColor.value)
  return {
    '--el-slider-runway-bg-color': `linear-gradient(to right, #000000, ${lightHex})`,
    '--el-slider-main-bg-color': lightHex
  }
})

// 颜色值更改，触发更新 | The color value changes, triggering the update
watch(
  () => originHexColor.value,
  (value, oldValue) => {
    if (value !== oldValue) {
      emits('update:model-value', value)
      return
    }
  }
)

// 手动输入颜色或选择预制颜色时，计算新的颜色区域坐标 | When a color is entered manually or a premade color is selected, the new color area coordinates are calculated
function handleColorChange(hex: string) {
  if (props.disabled) {
    return
  }
  const color = hexToColor(hex)
  const { color: lightRgb, value: depth } = getLightColorAndDepth(color)
  lightColor.value = lightRgb
  colorDepth.value = depth
  const coordin = getCoordinateByColor(lightRgb)
  setCirclePickerCoordinate(coordin.x, coordin.y, canvasWidth, canvasHeight)
}

onMounted(() => {
  handleColorChange(color.value)
})
</script>

<style lang="scss">
.hv-color-picker {
  box-sizing: border-box;
  width: 264px;
  padding: 12px;
  font-size: 12px;
  color: #fff;
  background-color: #212326;
  border: 1px solid #353d46;
  border-radius: 4px;
  box-shadow: 0 12px 24px 0 #00000080;

  .hv-color-picker__title {
    margin-bottom: 12px;
    font-weight: bold;
  }

  .hv-color-picker__area-outer {
    width: auto;
    border: 5px solid #000;
    border-radius: 3px;

    .hv-color-picker__area {
      position: relative;
      width: auto;
      height: 168px;
      overflow: hidden;
      background-color: #000;

      &.is-disabled {
        cursor: not-allowed;
      }

      canvas {
        width: 100%;
        height: 100%;
      }

      .hv-color-picker__circle {
        position: absolute;
        box-sizing: border-box;
        width: 18px;
        height: 18px;
        border: 3px solid #dcdcdc;
        border-radius: 50%;
        box-shadow:
          0 2px 4px -1px #0000001f,
          0 4px 5px 0 #00000014,
          0 1px 10px 0 #0000000d;
        transform: translate(-50%, -50%);
      }
    }
  }

  .hv-color-picker__slider {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .hv-color-picker__origin-color {
      width: 18px;
      height: 18px;
      margin-left: 12px;
      border-radius: 2px;
    }
  }

  .el-slider {
    box-sizing: border-box;

    .el-slider__runway {
      width: 210px;
      height: 8px;
      background: var(--el-slider-runway-bg-color);

      .el-slider__bar {
        background-color: transparent;
      }

      .el-slider__button-wrapper {
        .el-slider__button {
          box-sizing: border-box;
          width: 18px;
          height: 18px;
          background-color: var(--el-slider-main-bg-color);
          border-color: #fff;
          border-width: 3px;
        }
      }
    }
  }
}
</style>
