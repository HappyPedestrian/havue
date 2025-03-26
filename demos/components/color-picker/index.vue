<template>
  <div>颜色：<input type="color" v-model="color" /></div>
  <PdColorPicker v-model="color"></PdColorPicker>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { PdColorPicker } from '@pedy/color-picker'
import { PdColorPicker } from '@pedy/components'

const color = ref('#ffffff')
</script>
