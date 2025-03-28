import type { SFCWithInstall } from '@havue/utils'
import { withInstall } from '@havue/utils'
import Draggable from './Draggable.vue'
import Droppable from './Droppable.vue'

export const HvDraggable: SFCWithInstall<typeof Draggable> = withInstall(Draggable)
export const HvDroppable: SFCWithInstall<typeof Droppable> = withInstall(Droppable)

export type { DragAndDropPoint, DragAndDropDragType, DnDManager } from './manager'
