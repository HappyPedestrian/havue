<template>
  <div class="hv-color-picker__preset">
    <div class="hv-color-picker__preset-title">{{ props.title || 'Reset colors' }}</div>
    <div class="hv-color-picker__preset-list">
      <div
        class="hv-color-picker__preset-list-item"
        @click="handleClickColor(color)"
        v-for="color in preColors"
        :key="color"
        :style="{ backgroundColor: color }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const defaultPresetColors = [
  '#000000',
  '#FFFFFF',
  '#E3822D',
  '#DCE24F',
  '#1DCF69',
  '#6DE5B9',
  '#11A1F2',
  '#AA43FF',
  '#F0689C',
  '#F8D28B',
  '#606368',
  '#E83C34',
  '#EEBE29',
  '#89F0AC',
  '#2FBC9E',
  '#56CCF2',
  '#1C1DFA',
  '#DC88F5',
  '#D4C595',
  '#C52F65'
]

const props = defineProps<{
  title?: string
  presetColors?: string[]
}>()

const preColors = computed(() => {
  return !props.presetColors ? defaultPresetColors : props.presetColors
})

const emits = defineEmits<{
  (name: 'change', value: string): void
}>()

function handleClickColor(color: string) {
  emits('change', color)
}
</script>

<style lang="scss" scoped>
.hv-color-picker__preset {
  .hv-color-picker__preset-title {
    margin-bottom: 4px;
    font-size: 12px;
    color: #cad1e0;
  }

  .hv-color-picker__preset-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .hv-color-picker__preset-list-item {
      width: 18px;
      height: 18px;

      // 一行十个
      margin-right: calc((100% - 18px * 10) / 9);
      margin-bottom: 4px;
      cursor: pointer;
      border-radius: 2px;

      &:nth-child(10n) {
        margin-right: 0;
      }
    }
  }
}
</style>
