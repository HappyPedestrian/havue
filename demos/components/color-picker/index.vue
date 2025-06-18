<template>
  <div class="color-picker-demo">
    <div>颜色：<input type="color" v-model="color" /></div>
    <HvColorPicker v-model="color" :preset-colors="['#fff', '#000']"></HvColorPicker>
    <hr />
    <HvColorPickerNormal v-model="color"></HvColorPickerNormal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HvColorPicker, HvColorPickerNormal } from '@havue/components'

const color = ref('#ffffff')
</script>

<style lang="scss">
// 重置文档默认样式，避免影响el-select的样式。
.color-picker-demo {
  ul {
    padding: 0;
    margin: 0;
  }
}
</style>
