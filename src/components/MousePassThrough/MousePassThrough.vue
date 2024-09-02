<template>
	<div ref="boxRef" class="mouse-pass-through"></div>
</template>

<script setup lang="ts">
import type { PropsType } from './types'
import { useMousePassThrough } from './hooks/useMousePassThrough'

const props = defineProps<PropsType>()

const { boxRef } = useMousePassThrough(props)
</script>

<style lang="scss" scoped>
.mouse-pass-through {
	width: 100%;
	height: 100%;
}
</style>
