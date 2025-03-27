<template>
  <div>颜色：<input type="color" v-model="color" /></div>
  <PdColorPicker v-model="color"></PdColorPicker>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { PdColorPicker } from '@havue/color-picker'
import { PdColorPicker } from '@havue/components'

const color = ref('#ffffff')
</script>
