<template>
  <div class="color-picker-demo">
    <h3>HvHvColorPicker/HvColorPickerRainbow</h3>
    <div>Color：<input type="color" v-model="color" /></div>
    <HvColorPicker v-model="color" :preset-colors="['#fff', '#000']"></HvColorPicker>
    <hr />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HvColorPicker } from '@havue/components'

const color = ref('#ffffff')
</script>

<style lang="scss"></style>
