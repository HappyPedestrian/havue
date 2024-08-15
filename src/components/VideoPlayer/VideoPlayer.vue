<template>
	<div ref="containerRef" class="video-player" :style="{ width: `${props.width}px`, height: `${props.height}px` }">
		<canvas ref="canvasRef" :width="props.width" :height="props.height"></canvas>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import WsVideoManager from '@/utils/wsVideoManager/index'

const props = withDefaults(
	defineProps<{
		url: string
		width?: number
		height?: number
	}>(),
	{
		width: 640,
		height: 320,
	}
)

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref()

onMounted(() => {
	WsVideoManager.addCanvas(canvasRef.value, props.url)
})

onUnmounted(() => {
	WsVideoManager.removeCanvas(canvasRef.value)
})
</script>

<style lang="scss" scoped>
.video-player {
	canvas {
		height: 100%;
		width: 100%;
	}
}
</style>
