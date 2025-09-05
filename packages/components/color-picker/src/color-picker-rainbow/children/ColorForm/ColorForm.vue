<template>
  <div class="hv-color-picker__color-form">
    <div class="mb-12">
      <el-input
        v-model="hexColor"
        :disabled="props.disabled"
        :formatter="hexFormater"
        @change="handleHexColorChange"
      ></el-input>
    </div>
    <div class="hv-color-picker__form-group mb-12">
      <div class="hv-color-picker__form-label">RGB</div>
      <el-input-number
        v-model="formInputRGB.r"
        :disabled="props.disabled"
        @change="handleRgbColorChange"
        step-strictly
        :min="0"
        :max="255"
        :step="1"
        :controls="false"
      ></el-input-number>
      <el-input-number
        v-model="formInputRGB.g"
        :disabled="props.disabled"
        @change="handleRgbColorChange"
        step-strictly
        :min="0"
        :max="255"
        :step="1"
        :controls="false"
      ></el-input-number>
      <el-input-number
        v-model="formInputRGB.b"
        :disabled="props.disabled"
        @change="handleRgbColorChange"
        step-strictly
        :min="0"
        :max="255"
        :step="1"
        :controls="false"
      ></el-input-number>
    </div>
    <div class="hv-color-picker__form-group mb-12">
      <div class="hv-color-picker__form-label">HSV</div>
      <el-input-number
        v-model="formInputHSV.h"
        :disabled="props.disabled"
        @change="handleHsvColorChange"
        :min="0"
        :max="360"
        step-strictly
        :step="1"
        :controls="false"
      ></el-input-number>
      <el-input-number
        v-model="formInputHSV.s"
        :disabled="props.disabled"
        @change="handleHsvColorChange"
        :min="0"
        :max="100"
        step-strictly
        :step="1"
        :controls="false"
      ></el-input-number>
      <el-input-number
        v-model="formInputHSV.v"
        :disabled="props.disabled"
        @change="handleHsvColorChange"
        step-strictly
        :min="0"
        :max="100"
        :controls="false"
      ></el-input-number>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RgbColorType, HsvColorType } from '../../utils/color'
import { ref, reactive, watch } from 'vue'
import Color from 'color'
import { DEFAULT_COLOR } from '../../../constants'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()
const emits = defineEmits<{
  (name: 'change', value: string): void
}>()

/** 16进制颜色 | Hexadecimal color */
const hexColor = ref<string>(Color(props.modelValue || DEFAULT_COLOR).hex())

/** rgb */
const formInputRGB = reactive<RgbColorType>(
  Color(hexColor.value || DEFAULT_COLOR)
    .rgb()
    .object() as RgbColorType
)

/** hsv */
const formInputHSV = reactive<HsvColorType>(
  Color(hexColor.value || DEFAULT_COLOR)
    .hsv()
    .object() as HsvColorType
)

/**
 * 格式化16进制颜色输入 | Format hexadecimal color input
 * @param {string} value
 */
function hexFormater(value: string) {
  return `#${value
    .replace(/[^0-9A-F]/gi, '')
    .slice(0, 6)
    .toUpperCase()}`
}

// modelValue 属性更改，更新相关颜色字段 | modelValue property changed to update the relevant color field
watch(
  () => props.modelValue,
  (value) => {
    const colorIns = Color(value)

    hexColor.value = colorIns.hex()

    const { r, g, b } = colorIns.rgb().object()
    const { h, s, v } = colorIns.hsv().object()

    Object.assign(formInputRGB, {
      r,
      g,
      b
    })
    Object.assign(formInputHSV, {
      h,
      s,
      v
    })
  }
)

/**
 * 16进制颜色更改，触发change事件 | When the hexadecimal color changes, the change event is fired
 */
function handleHexColorChange() {
  let value = hexColor.value || ''
  const len = value.replace(/[^0-9A-F]/gi, '').length
  if (len === 6) {
    emits('change', hexColor.value)
  } else {
    hexColor.value = props.modelValue
  }
}

/**
 * rgb颜色更改，触发change事件 | The rgb color changes, triggering the change event
 */
function handleRgbColorChange() {
  const { r, g, b } = formInputRGB
  emits('change', Color.rgb(r, g, b).hex().toString())
}

/**
 * hsv颜色更改，触发change事件 | The hsv color changes, triggering the change event
 */
function handleHsvColorChange() {
  const { h, s, v } = formInputHSV
  emits('change', Color.hsv(h, s, v).hex().toString())
}
</script>

<style lang="scss">
.hv-color-picker__color-form {
  width: 100%;
  overflow: hidden;

  .mb-12 {
    margin-bottom: 12px;
  }

  .el-input {
    --el-input-border-color: #30343b;

    .el-input__wrapper {
      padding-right: 10px;
      padding-left: 10px;
      background-color: #101114;
      border-radius: 2px;

      .el-input__inner {
        text-align: left;
      }
    }
  }

  .hv-color-picker__form-group {
    display: flex;
    align-items: center;

    .hv-color-picker__form-label {
      width: 72px;
    }

    .el-input {
      flex: 1;
    }
  }
}
</style>
