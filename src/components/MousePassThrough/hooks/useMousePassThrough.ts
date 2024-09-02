import type { PropsType } from '../types'
import { ref, onBeforeUnmount } from 'vue'
import { useTouchEvent } from '@/plugins/touch/hooks'

type PositionType = {
	x: number
	y: number
}

export function useMousePassThrough(props: PropsType) {
	const boxRef = ref<HTMLDivElement | null>(null)

	const { destroy } = useTouchEvent(boxRef, {
		tap: {
			handler: handleTap,
		},
		pan: {
			handler: handlePan,
		},
	})

	function handleTap(e: HammerInput) {
		if (!boxRef.value) {
			return
		}
		const { x, y } = e.center
		const pos = transformMousePosToTargetPos(x, y, boxRef.value, props.width, props.height)
		console.log('tap:', pos)
	}

	function handlePan(e: HammerInput) {
		if (!boxRef.value) {
			return
		}
		const { x, y } = e.center
		const pos = transformMousePosToTargetPos(x, y, boxRef.value, props.width, props.height)
		console.log('pan:', pos)
	}

	onBeforeUnmount(() => {
		destroy()
	})

	return {
		boxRef,
	}
}

/**
 *
 * @param x 鼠标x
 * @param y 鼠标y
 * @param el 透传区域元素
 * @param targetWidth 目标透传区域实际宽度
 * @param targetHeight 目标透传区域实际高度
 * @returns { PositionType }
 */
function transformMousePosToTargetPos(x: number, y: number, el: HTMLDivElement, targetWidth: number, targetHeight: number): PositionType {
	const rect = el?.getBoundingClientRect()
	if (!rect) {
		return { x: 0, y: 0 }
	}
	const { top, left, width: elWidth, height: elHeight } = rect
	/** 在元素中横坐标 */
	let elX = x
	/** 在元素中纵坐标 */
	let elY = y

	elX = x < left ? 0 : x > left + elWidth ? elWidth : x - left
	elY = y < top ? 0 : y > top + elHeight ? elHeight : y - top

	// 计算透传实际宽高和元素宽高的比值
	const scaleX = elWidth !== 0 ? targetWidth / elWidth : 0
	const scaleY = elHeight !== 0 ? targetHeight / elHeight : 0

	const targetX = elX * scaleX
	const targetY = elY * scaleY

	return {
		x: Math.round(targetX),
		y: Math.round(targetY),
	}
}
