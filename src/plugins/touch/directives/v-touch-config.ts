import type { Directive, DirectiveBinding } from 'vue'
import type { GestureType, MultiGestureOptionsType } from '../core/touch'
import Touch, { Gestures } from '../core/touch'

export interface TouchHTMLElement extends HTMLElement {
  __touch?: Touch<TouchHTMLElement>
}

export type VTouchConfigBindingValueType = Partial<MultiGestureOptionsType>

// v-touch-config 指令: 为一个或多个手势进行配置
const VTouchConfig: Directive = {
  mounted(el: TouchHTMLElement, binding: DirectiveBinding<VTouchConfigBindingValueType>) {
    const { value } = binding

    if (!value || typeof value !== 'object' || Array.isArray(value)) return

    let touch = el.__touch
    if (!touch) {
      touch = new Touch(el)
      el.__touch = touch
    }

    const multiGestureOptions = value

    for (const gesture of Object.keys(multiGestureOptions)) {
      if (!Gestures.includes(gesture as GestureType)) continue

      touch.reWriteGestureConfig(gesture as GestureType, multiGestureOptions[gesture])
    }
  },

  beforeUnmount(el: TouchHTMLElement) {
    el.__touch?.destroy()

    el.__touch && delete el.__touch
  }
}

export { VTouchConfig }
