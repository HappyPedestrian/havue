import type { SFCWithInstall } from '@pedy/utils'
import { withInstall } from '@pedy/utils'
import DragAndScale from './DragAndScale.vue'

export const PdDragAndScale: SFCWithInstall<typeof DragAndScale> = withInstall(DragAndScale)

export default PdDragAndScale

export type {
  DragAndScaleOptions,
  DragAndScalePoint,
  DragAndScaleChangeResultType,
  useDragAndScale
} from './hooks/useDragAndScale'
