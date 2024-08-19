import type { Directive, DirectiveBinding } from 'vue'
import type { GestureType, GestureEventType, GestureEventCallbackType } from '../core/touch'
import Touch, { GestureEvents } from '../core/touch'

export enum DIRECTIONS {
  DIRECTION_NONE = 1,
  DIRECTION_LEFT = 2,
  DIRECTION_RIGHT = 4,
  DIRECTION_UP = 8,
  DIRECTION_DOWN = 16,
  DIRECTION_HORIZONTAL = 6, // DIRECTION_LEFT | DIRECTION_RIGHT
  DIRECTION_VERTICAL = 24, // DIRECTION_UP | DIRECTION_DOWN
  DIRECTION_ALL = 30 // DIRECTION_HORIZONTAL | DIRECTION_VERTICAL
}

export enum MODIFIERS {
  STOP = 'stop'
}

export interface TouchHTMLElement extends HTMLElement {
  __touch?: Touch<TouchHTMLElement>
}

export type GestureEventOptionsType = {
  handler: GestureEventCallbackType | GestureEventCallbackType[]
  config?: {
    stopPropagation: boolean
  }
}

export type VTouchBindingValueType =
  | GestureEventCallbackType
  | Partial<Record<GestureEventType, GestureEventOptionsType>>

// v-touch 指令的编写
// 目前指令只支持绑定在 dom 元素上, 不支持绑定在组件上
const VTouch: Directive = {
  mounted(el: TouchHTMLElement, binding: DirectiveBinding<VTouchBindingValueType>) {
    // 解构获取(:)符号后的参数 arg, (=)符号后的绑定函数或对象 value
    const { arg: eventName, modifiers, value } = binding

    // v-touch:tap.stop 形式使用指令
    if (typeof value === 'function') {
      if (!eventName) {
        console.error('Must to give touch directive a arg, just like v-touch:tap.')
        return
      }

      // 判断事件是否支持
      const supportedEventNameList: string[] = [...GestureEvents]
      if (!supportedEventNameList.includes(eventName)) {
        console.error(`Can't find event which name is ${eventName}`)
        return
      }

      let touch = el.__touch
      if (!touch) {
        touch = new Touch(el)
        el.__touch = touch
      }

      const eventCallback = value

      const stopPropagation = modifiers[MODIFIERS.STOP] === undefined ? false : true

      if (!touch.isEventListenerExist(eventName as GestureEventType, eventCallback)) {
        touch.addEventListener(eventName as GestureEventType, eventCallback, { bubble: !stopPropagation })
      }
    } else if (typeof value === 'object') {
      // v-touch="{ tap: () => {} }" 对象形式使用指令
      const events = value

      let touch = el.__touch
      if (!touch) {
        touch = new Touch<TouchHTMLElement>(el)

        el.__touch = touch
      }

      if (!events) return

      const eventNameList = Object.keys(events) as GestureEventType[]

      // 用于判断事件是否支持
      const supportedEventNameList: string[] = [...GestureEvents]

      for (let i = 0; i < eventNameList.length; i++) {
        if (!supportedEventNameList.includes(eventNameList[i])) {
          console.error(`Can't find event which name is ${eventNameList[i]}`)
          continue
        }

        const singleEventOptions = events[eventNameList[i]]!

        const handler = singleEventOptions.handler

        // 获取是否阻止冒泡配置
        const { stopPropagation = false } = singleEventOptions.config || {}

        if (!handler) continue

        if (Array.isArray(handler)) {
          for (const cb of handler) {
            if (touch.isEventListenerExist(eventNameList[i], cb)) continue

            touch.addEventListener(eventNameList[i], cb, { bubble: !stopPropagation })
          }
        } else {
          if (!touch.isEventListenerExist(eventNameList[i], handler)) {
            touch.addEventListener(eventNameList[i], handler, { bubble: !stopPropagation })
          }
        }
      }
    } else {
      console.error('touch: directive value must be function or object.')
    }
  },

  beforeUnmount(el: TouchHTMLElement) {
    el.__touch?.destroy()

    el.__touch && delete el.__touch
  }
}

export { VTouch }
export type { GestureType, GestureEventType }
