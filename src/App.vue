<script setup lang="ts">
import { ref } from 'vue'
import ColorPicker from './components/ColorPicker/ColorPicker.vue'

const color = ref('#ffffff')
</script>

<template>
	<div>颜色：<input type="color" v-model="color" /></div>
	<ColorPicker v-model="color"></ColorPicker>
</template>

<style lang="scss" scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
