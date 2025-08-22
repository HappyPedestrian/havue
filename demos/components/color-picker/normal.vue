<template>
  <div class="color-picker-demo">
    <h3>HvColorPickerNormal</h3>
    <div>Color：<input type="color" v-model="inputColor" /></div>
    <HvColorPickerNormal v-model="color"></HvColorPickerNormal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { HvColorPickerNormal } from '@havue/components'

const inputColor = ref('#ffffff')
const color = ref('#ffffff')

watch(inputColor, (val) => {
  color.value = val
})

watch(color, (val) => {
  inputColor.value = val.substring(0, 7)
})
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
