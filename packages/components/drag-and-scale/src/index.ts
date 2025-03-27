import type { SFCWithInstall } from '@havue/utils'
import { withInstall } from '@havue/utils'
import DragAndScale from './DragAndScale.vue'

export const PdDragAndScale: SFCWithInstall<typeof DragAndScale> = withInstall(DragAndScale)

export default PdDragAndScale

export type {
  DragAndScaleOptions,
  DragAndScalePoint,
  DragAndScaleChangeResultType,
  useDragAndScale
} from './hooks/useDragAndScale'
