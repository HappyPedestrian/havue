import type { SFCWithInstall } from '@pedy/utils'
import { withInstall } from '@pedy/utils'
import ColorPicker from './ColorPicker.vue'

export const PdColorPicker: SFCWithInstall<typeof ColorPicker> = withInstall(ColorPicker)

export default PdColorPicker
