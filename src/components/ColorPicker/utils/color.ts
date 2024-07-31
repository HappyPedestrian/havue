import type ColorConstruct from 'color'
import Color from 'color'

export function hexToColor(hex: string): ColorConstruct {
	const colorIns = Color(hex)
	return colorIns
}

/**
 * 输入rgb，返回16进制颜色
 * @param {ColorConstruct} color
 * @returns {string}
 */
export function colorToHex(color: ColorConstruct): string {
	return color.hex()
}

/**
 * 根据颜色值，计算得到hsv深度100的颜色和当前深度值
 * @param { ColorConstruct } color
 * @returns {
 *   color: ColorConstruct
 *   value: number [0-100]
 * }
 *
 */
export function getLightColorAndDepth(color: ColorConstruct): {
	color: ColorConstruct
	value: number
} {
	const { h, s, v } = color.hsv().object()

	return {
		color: Color.hsv(h, s, 100),
		value: v,
	}
}

/**
 * 根据高亮区域的颜色和缩放比例，计算得到原始rgb颜色值
 * @param { ColorConstruct } color
 * @param { number } value 深度 [0-100]
 * @returns ColorConstruct
 *
 */
export function getOriginColorByLightAndDepth(color: ColorConstruct, value: number): ColorConstruct {
	const { h, s } = color.hsv().object()
	return Color.hsv(h, s, value)
}

/**
 * 根据canvas高亮区域的颜色和深度值，计算得到原始hex颜色值
 * @param { ColorConstruct } color
 * @param { number } value 深度 [0-100]
 * @returns string
 *
 */
export function getOriginHexByLightAndDepth(color: ColorConstruct, value: number): string {
	const originColor = getOriginColorByLightAndDepth(color, value)
	return colorToHex(originColor)
}
