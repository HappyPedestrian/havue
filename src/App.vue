<script setup lang="ts">
import { ref } from 'vue'
import ColorPicker from './components/ColorPicker/ColorPicker.vue'
import VideoPlayer from './components/VideoPlayer/VideoPlayer.vue'

const color = ref('#ffffff')
</script>

<template>
	<div>颜色：<input type="color" v-model="color" /></div>
	<ColorPicker v-model="color"></ColorPicker>
	<div class="video-list">
		<VideoPlayer v-for="i in 24" :key="i"></VideoPlayer>
	</div>
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
.video-list {
	height: auto;
	width: 1080px;
	display: flex;
	flex-wrap: wrap;
	.video-player {
		height: 100px;
		width: 180px;
	}
}
</style>
