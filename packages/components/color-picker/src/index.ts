import type { SFCWithInstall } from '@havue/utils'
import { withInstall } from '@havue/utils'
import ColorPicker from './ColorPicker.vue'

export const PdColorPicker: SFCWithInstall<typeof ColorPicker> = withInstall(ColorPicker)

export default PdColorPicker
