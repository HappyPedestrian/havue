import type { SFCWithInstall } from '@havue/utils'
import { withInstall } from '@havue/utils'
import ColorPickerRainbow from './color-picker-rainbow/ColorPicker.vue'
import ColorPickerNormal from './color-picker-normal/ColorPicker.vue'
export * from './constants'

export const HvColorPicker: SFCWithInstall<typeof ColorPickerRainbow> = withInstall(ColorPickerRainbow)
export const HvColorPickerRainbow = HvColorPicker

export const HvColorPickerNormal: SFCWithInstall<typeof ColorPickerNormal> = withInstall(ColorPickerNormal)

export default HvColorPicker
