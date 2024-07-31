<template>
	<div class="color-form">
		<div class="hex-color mb-12">
			<el-input v-model="hexColor" :formatter="hexFormater" @change="handleHexColorChange"></el-input>
		</div>
		<div class="form-group mb-12">
			<div class="label">RGB</div>
			<el-input-number
				v-model="formInputRGB.r"
				@change="handleRgbColorChange"
				step-strictly
				:min="0"
				:max="255"
				:step="1"
				:controls="false"
			></el-input-number>
			<el-input-number
				v-model="formInputRGB.g"
				@change="handleRgbColorChange"
				step-strictly
				:min="0"
				:max="255"
				:step="1"
				:controls="false"
			></el-input-number>
			<el-input-number
				v-model="formInputRGB.b"
				@change="handleRgbColorChange"
				step-strictly
				:min="0"
				:max="255"
				:step="1"
				:controls="false"
			></el-input-number>
		</div>
		<div class="form-group mb-12">
			<div class="label">HSV</div>
			<el-input-number
				v-model="formInputHSV.h"
				@change="handleHsvColorChange"
				:min="0"
				:max="360"
				step-strictly
				:step="1"
				:controls="false"
			></el-input-number>
			<el-input-number
				v-model="formInputHSV.s"
				@change="handleHsvColorChange"
				:min="0"
				:max="100"
				step-strictly
				:step="1"
				:controls="false"
			></el-input-number>
			<el-input-number
				v-model="formInputHSV.v"
				@change="handleHsvColorChange"
				step-strictly
				:min="0"
				:max="100"
				:controls="false"
			></el-input-number>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { RgbColorType, HsvColorType } from '../../utils/color'
import { ref, reactive, watch } from 'vue'
import Color from 'color'

const DEFAULT_COLOR = '#ffffff'

const props = defineProps<{
	modelValue: string
}>()
const emits = defineEmits<{
	(name: 'change', value: string): void
}>()

/** 16进制颜色 */
const hexColor = ref<string>(Color(props.modelValue || DEFAULT_COLOR).hex())

/** rgb颜色 */
const formInputRGB = reactive<RgbColorType>(
	Color(hexColor.value || DEFAULT_COLOR)
		.rgb()
		.object() as RgbColorType
)

/** hsv颜色 */
const formInputHSV = reactive<HsvColorType>(
	Color(hexColor.value || DEFAULT_COLOR)
		.hsv()
		.object() as HsvColorType
)

/**
 * 格式化16进制颜色输入
 * @param {string} value
 */
function hexFormater(value: string) {
	return `#${value
		.replace(/[^0-9A-F]/gi, '')
		.slice(0, 6)
		.toUpperCase()}`
}

// 外部颜色更改，更新内部颜色值
watch(
	() => props.modelValue,
	(value) => {
		const colorIns = Color(value)

		hexColor.value = colorIns.hex()

		const { r, g, b } = colorIns.rgb().object()
		const { h, s, v } = colorIns.hsv().object()

		Object.assign(formInputRGB, {
			r,
			g,
			b,
		})
		Object.assign(formInputHSV, {
			h,
			s,
			v,
		})
	}
)

/**
 * 16进制颜色更改，触发change事件
 */
function handleHexColorChange() {
	let value = hexColor.value || ''
	const len = value.replace(/[^0-9A-F]/gi, '').length
	if (len === 6) {
		emits('change', hexColor.value)
	} else {
		hexColor.value = props.modelValue
	}
}

/**
 * rgb颜色更改，触发change事件
 */
function handleRgbColorChange() {
	const { r, g, b } = formInputRGB
	emits('change', Color.rgb(r, g, b).hex().toString())
}

/**
 * hsv颜色更改，触发change事件
 */
function handleHsvColorChange() {
	const { h, s, v } = formInputHSV
	emits('change', Color.hsv(h, s, v).hex().toString())
}
</script>

<style lang="scss" scoped>
.color-form {
	gap: 12px;
	.mb-12 {
		margin-bottom: 12px;
	}
	:deep(.el-input) {
		--el-input-border-color: #30343b;
		.el-input__wrapper {
			padding-left: 10px;
			padding-right: 10px;
			background-color: #101114;
			border-radius: 2px;
			.el-input__inner {
				text-align: left;
			}
		}
	}
	.form-group {
		display: flex;
		align-items: center;
		.label {
			width: 72px;
		}
		:deep(.el-input) {
			flex: 1;
		}
	}
}
</style>
