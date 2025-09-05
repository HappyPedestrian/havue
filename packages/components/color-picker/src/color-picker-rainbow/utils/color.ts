import type ColorConstruct from 'color'
import Color from 'color'

export type RgbColorType = {
  r: number
  g: number
  b: number
}

export type HsvColorType = {
  h: number
  s: number
  v: number
}

export function hexToColor(hex: string): ColorConstruct {
  const colorIns = Color(hex)
  return colorIns
}

/**
 * 获取16进制颜色 | Gets the hexadecimal color
 * @param {ColorConstruct} color
 * @returns {string}
 */
export function colorToHex(color: ColorConstruct): string {
  return color.hex()
}

/**
 * 根据颜色值，计算得到hsv深度100的颜色和当前深度值 | Based on the color value, the color and the current depth value of hsv depth 100 are calculated
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
    value: v
  }
}

/**
 * 根据高亮区域的颜色和缩放比例，计算得到原始rgb颜色值 | According to the color of the highlighted area and the zoom ratio, the original rgb color value is calculated
 * @param { ColorConstruct } color
 * @param { number } value 深度(value) [0-100]
 * @returns ColorConstruct
 *
 */
export function getOriginColorByLightAndDepth(color: ColorConstruct, value: number): ColorConstruct {
  const { h, s } = color.hsv().object()
  return Color.hsv(h, s, value)
}

/**
 * 根据canvas高亮区域的颜色和深度值，计算得到原始hex颜色值 | The raw hex color values are computed from the color and depth values of the highlighted areas of the canvas
 * @param { ColorConstruct } color
 * @param { number } value 深度(value) [0-100]
 * @returns string
 *
 */
export function getOriginHexByLightAndDepth(color: ColorConstruct, value: number): string {
  const originColor = getOriginColorByLightAndDepth(color, value)
  return colorToHex(originColor)
}
