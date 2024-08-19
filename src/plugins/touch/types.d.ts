import type { VTouchBindingValueType } from './directives/v-touch'
import type { VTouchConfigBindingValueType } from './directives/v-touch-config'

// 为指令提供类型提示
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    vTouch: Directive<Element, VTouchBindingValueType>
    vTouchConfig: Directive<Element, VTouchConfigBindingValueType>
    vGhostClick: Directive<Element, boolean>
  }
}

export type * from './core/touch'
export type { VTouchBindingValueType, VTouchConfigBindingValueType }
