<template>
  <div class="hv-color-picker">
    <div class="hv-color-picker__title">{{ props.title || '颜色编辑器' }}</div>
    <div class="hv-color-picker__area-outer">
      <div class="hv-color-picker__area" ref="colorAreaRef">
        <canvas ref="colorAreaCanvas"></canvas>
        <div class="hv-color-picker__circle" :style="cilcleStyle"></div>
      </div>
    </div>

    <div class="hv-color-picker__slider">
      <ElSlider v-model="colorDepth" :min="0" :max="100" :show-tooltip="false" :style="sliderBackStyle"></ElSlider>
      <div class="hv-color-picker__origin-color" :style="{ backgroundColor: originHexColor }"></div>
    </div>
    <ColorForm :model-value="color" @change="handleColorChange"></ColorForm>
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

defineOptions({
  name: 'HvColorPicker'
})

const DEFAULT_COLOR = '#FFFFFF'

const props = defineProps<{
  title?: string
  presetTitle?: string
  presetColors?: string[]
}>()

const emits = defineEmits<{
  (name: 'update:model-value', value: string): void
}>()
const { colorAreaCanvas, getColorByCoordinate, getCoordinateByColor, canvasWidth, canvasHeight } = useColorArea()
const { colorAreaRef, circlePickerCoordinate, setCirclePickerCoordinate } = useOperateEvent()

// const color = ref<string>('#ffccaa')
const color = defineModel({
  type: String,
  default: DEFAULT_COLOR
})

/** 高亮 在canvas颜色区域中的颜色 */
const lightColor = ref<ColorConstruct>(Color(DEFAULT_COLOR))
/** 滑块 hsv 深度缩放 */
const colorDepth = ref(100)

/** 根据 lightColor 以及 colorDepth 计算出的实际显示16进制颜色值*/
const originHexColor = computed(() => {
  if (lightColor.value) {
    const hex = getOriginHexByLightAndDepth(lightColor.value, colorDepth.value)
    return hex
  }
  return DEFAULT_COLOR
})

// 颜色值更改，更新显示
watch(color, (val) => {
  const hex = getOriginHexByLightAndDepth(lightColor.value, colorDepth.value)
  if (hex === val) {
    return
  }
  handleColorChange(val)
})

// 颜色区域坐标更改，计算新的颜色值
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

// 当前颜色圆形图标位置样式
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

// 颜色明暗度slider背景颜色
const sliderBackStyle = computed(() => {
  const lightHex = colorToHex(lightColor.value)
  return {
    '--el-slider-runway-bg-color': `linear-gradient(to right, #000000, ${lightHex})`,
    '--el-slider-main-bg-color': lightHex
  }
})

// 颜色值更改，触发更新
watch(
  () => originHexColor.value,
  (value, oldValue) => {
    if (value !== oldValue) {
      emits('update:model-value', value)
      return
    }
  }
)

// 手动输入颜色或选择预制颜色时，计算新的颜色区域坐标
function handleColorChange(hex: string) {
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
