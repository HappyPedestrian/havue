<template>
  <div class="hv-color_picker__form mb-12">
    <div class="hv-color-picker__form-type">
      <el-select
        v-model="formType"
        :disabled="props.disabled"
        popper-class="hv-color-picker-popper"
        @change="handleFormTypeChange"
        :teleported="false"
      >
        <el-option v-for="item in SelectOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div class="hv-color-picker__form-body">
      <el-input-number
        v-model="formInputState[0]"
        @change="handleColorChange"
        step-strictly
        :disabled="props.disabled"
        :min="0"
        :max="isRGB ? 255 : 360"
        :step="1"
        :controls="false"
      ></el-input-number>
      <el-input-number
        v-model="formInputState[1]"
        @change="handleColorChange"
        step-strictly
        :disabled="props.disabled"
        :min="0"
        :max="isRGB ? 255 : 100"
        :step="1"
        :controls="false"
      ></el-input-number>
      <el-input-number
        v-model="formInputState[2]"
        @change="handleColorChange"
        step-strictly
        :disabled="props.disabled"
        :min="0"
        :max="isRGB ? 255 : 100"
        :step="1"
        :controls="false"
      ></el-input-number>
      <el-input-number
        v-model="formInputState[3]"
        @change="handleColorChange"
        step-strictly
        :disabled="props.disabled"
        :min="0"
        :max="100"
        :step="1"
        :controls="false"
      >
        <template #suffix>
          <span>%</span>
        </template>
      </el-input-number>
    </div>
  </div>
</template>

<script setup lang="ts">
import type ColorCunstruct from 'color'
import Color from 'color'
import { ref, computed, watch } from 'vue'
import { DEFAULT_COLOR } from '../../../constants'

const SelectOptions = ['RGB', 'HSL', 'HSV']

defineOptions({
  name: 'HvColorPickerNormal'
})

const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()
const emits = defineEmits<{
  (name: 'update:modelValue', value: string): void
}>()

const formType = ref('RGB')
const formInputState = ref([255, 255, 255, 100])

const isRGB = computed(() => {
  return formType.value === 'RGB'
})

watch(
  () => props.modelValue,
  () => {
    handleFormTypeChange()
  },
  {
    immediate: true
  }
)

function handleFormTypeChange() {
  const color = Color(props.modelValue)
  const alpha = color.alpha() * 100
  switch (formType.value) {
    case 'RGB': {
      const arr = color.rgb().array()
      formInputState.value = [...arr.slice(0, 3), alpha]
      break
    }
    case 'HSL': {
      const arr = color.hsl().array()
      formInputState.value = [...arr.slice(0, 3), alpha]
      break
    }
    case 'HSV': {
      const arr = color.hsv().array()
      formInputState.value = [...arr.slice(0, 3), alpha]
      break
    }
  }
}

function handleColorChange() {
  let color: ColorCunstruct = Color(DEFAULT_COLOR)

  switch (formType.value) {
    case 'RGB': {
      color = Color.rgb(...formInputState.value.slice(0, 3))
      break
    }
    case 'HSL': {
      color = Color.hsl(...formInputState.value.slice(0, 3))
      break
    }
    case 'HSV': {
      color = Color.hsv(...formInputState.value.slice(0, 3))
      break
    }
  }
  emits('update:modelValue', color.alpha(formInputState.value[3] / 100).hexa())
}
</script>

<style lang="scss">
.el-select__popper.el-popper.hv-color-picker-popper {
  --el-bg-color-overlay: #131519;
  --el-border-color: #3c4452;
  --el-fill-color-light: #0977e5;
  --el-border-color-light: #565d6b;

  .el-select-dropdown__item {
    color: #a8b0c1;
  }
}
</style>
<style lang="scss" scoped>
.hv-color_picker__form {
  display: flex;
  gap: 6px;
  margin-top: 6px;

  --el-fill-color-blank: #131519;
  --el-border-color: #3c4452;

  .hv-color-picker__form-type {
    :deep(.el-select) {
      --el-select-width: 60px;

      .el-select__wrapper {
        padding: 6px;

        .el-select__placeholder {
          width: fit-content;
          text-overflow: inherit;
          color: #c2c6cc;
        }
      }
    }
  }

  .hv-color-picker__form-body {
    display: flex;

    :deep(.el-input-number) {
      --el-text-color-regular: #c2c6cc;

      width: 23%;

      &:last-child {
        width: 31%;
      }

      .el-input__wrapper {
        padding: 0 4px;

        .el-input__suffix {
          .el-input__suffix-inner {
            span {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
}
</style>
