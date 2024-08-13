<template>
	<div class="video-player">
		<canvas ref="canvasRef"></canvas>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import WsVideoManager from '../../utils/wsVideoManager/index'

const canvasRef = ref()

onMounted(() => {
	WsVideoManager.addCanvas(canvasRef.value, 'ws://10.168.11.200:8080/record/1.mp4.live.mp4')
})

onUnmounted(() => {
	WsVideoManager.removeCanvas(canvasRef.value)
})
</script>

<style lang="scss" scoped>
.video-player {
	width: 640px;
	height: 320px;
	canvas {
		height: 100%;
		width: 100%;
	}
}
</style>
