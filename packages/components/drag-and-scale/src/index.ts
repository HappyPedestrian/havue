import type { SFCWithInstall } from '@havue/utils'
import { withInstall } from '@havue/utils'
import DragAndScale from './DragAndScale.vue'

export const HvDragAndScale: SFCWithInstall<typeof DragAndScale> = withInstall(DragAndScale)

export default HvDragAndScale

export type {
  DragAndScaleOptions,
  DragAndScalePoint,
  DragAndScaleChangeResultType,
  useDragAndScale
} from './hooks/useDragAndScale'
