<template>
  <div>颜色：<input type="color" v-model="color" /></div>
  <HvColorPicker v-model="color" :preset-colors="['#fff', '#000']"></HvColorPicker>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { PdColorPicker } from '@havue/color-picker'
import { HvColorPicker } from '@havue/components'

const color = ref('#ffffff')
</script>
