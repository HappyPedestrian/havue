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
		<VideoPlayer
			v-for="i in 10"
			:key="i"
			url="ws://10.168.11.200:8080/record/1.mp4.live.mp4"
			:width="i * 32"
			:height="i * 16"
		></VideoPlayer>
	</div>
	<div class="video-list">
		<VideoPlayer
			v-for="i in 10"
			:key="i"
			url="ws://10.168.11.200:8080/record/2.mp4.live.mp4"
			type="video"
			:width="i * 32"
			:height="i * 16"
		></VideoPlayer>
	</div>
	<canvas id="testCanvasId"></canvas>
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
