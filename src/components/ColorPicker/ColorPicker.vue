<template>
	<div class="color-picker">
		<div class="title">颜色编辑器</div>
		<div class="color-area__wrapper">
			<div class="color-area" ref="colorAreaRef">
				<canvas ref="colorAreaCanvas"></canvas>
				<div class="cur-color-circle" :style="cilcleStyle"></div>
			</div>
		</div>

		<div class="slider-color">
			<ElSlider v-model="colorDepth" :min="0" :max="100" :show-tooltip="false" :style="sliderBackStyle"></ElSlider>
			<div class="origin-color" :style="{ backgroundColor: originHexColor }"></div>
		</div>
		<ColorForm :model-value="color" @change="handleColorChange"></ColorForm>
		<PresetColors @change="handleColorChange"></PresetColors>
	</div>
</template>

<script setup lang="ts">
import type ColorConstruct from 'color'
import { ref, computed, watch, onMounted } from 'vue'
import Color from 'color'
import { useColorArea } from './hooks/useColorArea'
import { useMouseEvent } from './hooks/useMouseEvent'
import { getLightColorAndDepth, hexToColor, getOriginHexByLightAndScale, colorToHex } from './utils/color'
import ColorForm from './children/ColorForm/ColorForm.vue'
import PresetColors from './children/PresetColors/PresetColors.vue'

const DEFAULT_COLOR = '#ffffff'

const emits = defineEmits<{
	(name: 'update:model-value', value: string): void
}>()
const { colorAreaCanvas, getColorByCoordinate, getCoordinateByColor, canvasWidth, canvasHeight } = useColorArea()
const { colorAreaRef, circlePickerCoordinate, setCirclePickerCoordinate } = useMouseEvent()

// const color = ref<string>('#ffccaa')
const color = defineModel({
	type: String,
	default: DEFAULT_COLOR,
})

/** 高亮 在canvas颜色区域中的颜色 */
const lightColor = ref<ColorConstruct>(Color(DEFAULT_COLOR))
/** 滑块 hsv 深度缩放 */
const colorDepth = ref(100)

/** 根据 lightColor 以及 colorDepth 计算出的实际显示16进制颜色值*/
const originHexColor = computed(() => {
	if (lightColor.value) {
		const hex = getOriginHexByLightAndScale(lightColor.value, colorDepth.value)
		return hex
	}
	return DEFAULT_COLOR
})

watch(
	() => circlePickerCoordinate,
	(coordianate) => {
		const rect = colorAreaRef.value?.getBoundingClientRect()
		if (!rect) {
			return
		}

		const color = getColorByCoordinate(coordianate.x, coordianate.y, rect.width, rect.height)
		lightColor.value = color
	},
	{
		deep: true,
	}
)

const cilcleStyle = computed(() => {
	if (!color.value) {
		return {
			top: '100%',
			left: '0',
			backgroundColor: '#ffffff',
		}
	}
	return {
		top: circlePickerCoordinate.y + 'px',
		left: circlePickerCoordinate.x + 'px',
		backgroundColor: lightColor.value.hex(),
	}
})

const sliderBackStyle = computed(() => {
	const lightHex = colorToHex(lightColor.value)
	return {
		'--el-slider-runway-bg-color': `linear-gradient(to right, #000000, ${lightHex})`,
		'--el-slider-main-bg-color': lightHex,
	}
})

watch(
	() => originHexColor.value,
	(value, oldValue) => {
		if (value !== oldValue) {
			emits('update:model-value', value)
			return
		}
	}
)

function handleColorChange(hex: string) {
	const color = hexToColor(hex)
	const { color: lightRgb, value: depth } = getLightColorAndDepth(color)
	lightColor.value = lightRgb
	colorDepth.value = depth
	const coordin = getCoordinateByColor(lightRgb)
	setCirclePickerCoordinate(coordin.x, coordin.y, canvasWidth, canvasHeight)
}

onMounted(() => {
	handleColorChange(color.value)
})
</script>

<style lang="scss" scoped>
.color-picker {
	width: 264px;
	padding: 12px;
	color: #fff;
	font-size: 12px;
	background-color: #212326;
	border: 1px solid #353d46;
	border-radius: 4px;
	box-shadow: 0px 12px 24px 0px #00000080;
	box-sizing: border-box;
	.title {
		font-weight: bold;
		margin-bottom: 12px;
	}
	.color-area__wrapper {
		width: auto;
		border: 5px solid #000;
		border-radius: 3px;
		.color-area {
			position: relative;

			width: auto;
			height: 168px;
			background-color: #000;
			overflow: hidden;
			canvas {
				height: 100%;
				width: 100%;
			}
			.cur-color-circle {
				box-sizing: border-box;
				position: absolute;
				height: 18px;
				width: 18px;
				border: 3px solid #dcdcdc;
				border-radius: 50%;
				transform: translate(-50%, -50%);
				box-shadow: 0px 2px 4px -1px #0000001f, 0px 4px 5px 0px #00000014, 0px 1px 10px 0px #0000000d;
			}
		}
	}

	.slider-color {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.origin-color {
			margin-left: 12px;
			width: 18px;
			height: 18px;
			border-radius: 2px;
		}
	}
	:deep(.el-slider) {
		box-sizing: border-box;
		.el-slider__runway {
			width: 210px;
			height: 8px;
			background: var(--el-slider-runway-bg-color);
			.el-slider__bar {
				background-color: transparent;
			}
			.el-slider__button-wrapper {
				.el-slider__button {
					box-sizing: border-box;
					height: 18px;
					width: 18px;
					border-color: #fff;
					border-width: 3px;
					background-color: var(--el-slider-main-bg-color);
				}
			}
		}
	}
	.color-form {
		width: 100%;
		overflow: hidden;
	}
}
</style>
