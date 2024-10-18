// 封装 hammerjs
import Hammer from 'hammerjs'

export const Gestures = ['tap', 'tap2', 'doubletap', 'pan', 'pan2', 'pinch', 'press', 'swipe', 'rotate'] as const
export type GestureType = (typeof Gestures)[number]

export const GestureEvents = [
  'tap',
  'tap2',
  'doubletap',
  'pan',
  'panstart',
  'panmove',
  'pancancel',
  'panend',
  'panleft',
  'panright',
  'panup',
  'pandown',
  'pan2',
  'pan2start',
  'pan2move',
  'pan2cancel',
  'pan2end',
  'pan2left',
  'pan2right',
  'pan2up',
  'pan2down',
  'pinch',
  'pinchcancel',
  'pinchend',
  'pinchin',
  'pinchout',
  'pinchmove',
  'pinchstart',
  'press',
  'pressup',
  'rotate',
  'rotatecancel',
  'rotateend',
  'rotatemove',
  'rotatestart',
  'swipe',
  'swiperight',
  'swipeleft',
  'swipeup',
  'swipedown'
] as const
export type GestureEventType = (typeof GestureEvents)[number]

export type TouchInputType = HammerInput

export type GestureEventCallbackType = (e: TouchInputType) => void

export type GestureOptionsType = RecognizerOptions & {
  recognizeWith?: GestureType | GestureType[]
  requireFailure?: GestureType | GestureType[]
}

export type GestureEventOptionsType = {
  // 是否冒泡
  bubble?: boolean
}

export type MultiGestureOptionsType = Record<GestureType, GestureOptionsType>

export type InitOptionsType = {
  multiGestureOptions?: MultiGestureOptionsType
}

// 收集阻止事件冒泡的元素
const stopBubbleMap = new Map<GestureEventType, Set<HTMLElement>>()

class Touch<T extends HTMLElement = HTMLElement> {
  private _hammerManager: HammerManager | null
  private _el: T | null
  private _eventCallbackMap: Map<GestureEventType, GestureEventCallbackType[]> | null
  private _gestureConfigMap: Map<GestureType, GestureOptionsType> | null
  private _isDestroyed = false

  constructor(el: T, options?: InitOptionsType) {
    this._el = el

    this._eventCallbackMap = new Map()

    this._gestureConfigMap = new Map()

    this._hammerManager = new Hammer.Manager(el)

    const rotate = new Hammer.Rotate({ event: 'rotate' })

    const tap = new Hammer.Tap({ event: 'tap' })

    const doubletap = new Hammer.Tap({ event: 'doubletap', taps: 2, interval: 500 })

    const tap2 = new Hammer.Tap({ event: 'tap2', pointers: 2 })

    const pinch = new Hammer.Pinch({ event: 'pinch', pointers: 2, threshold: 0 })

    const pan = new Hammer.Pan({ event: 'pan', direction: Hammer.DIRECTION_ALL })

    const pan2 = new Hammer.Pan({ event: 'pan2', pointers: 2, direction: Hammer.DIRECTION_ALL })

    // 避免无法触发其他双指操作的问题
    rotate.recognizeWith(tap2)
    rotate.recognizeWith(pinch)
    rotate.recognizeWith(pan2)
    pinch.recognizeWith(pan2)
    pinch.recognizeWith(tap2)
    tap2.recognizeWith(tap)
    doubletap.recognizeWith(tap)

    // 双击未触发，才触发单击
    tap.requireFailure(doubletap)
    pan.requireFailure(pan2)

    this._hammerManager.add([
      pan2,
      pan,
      pinch,
      rotate,
      doubletap,
      tap2,
      tap,
      new Hammer.Swipe({ event: 'swipe', direction: Hammer.DIRECTION_ALL }),
      new Hammer.Press({ event: 'press' })
    ])

    if (!options) return

    const multiGestureOptions = options.multiGestureOptions

    if (!multiGestureOptions) return

    // 根据自定义配置来替换默认配置
    for (const gesture of Object.keys(multiGestureOptions)) {
      if (!Gestures.includes(gesture as GestureType)) continue

      this.reWriteGestureConfig(gesture as GestureType, multiGestureOptions[gesture as GestureType])
    }
  }

  get bindingElement() {
    return this._el
  }

  private bindEventCallback(eventName: GestureEventType) {
    if (!this._hammerManager || !this._eventCallbackMap) {
      console.error('touch instance was destroyed.')
      return
    }

    this._hammerManager.on(eventName, (e: HammerInput) => {
      const triggerEl = e.target

      let isStop = false
      const set = stopBubbleMap.get(eventName)

      if (set) {
        for (const stopBubbleEl of set) {
          // 过滤阻止冒泡元素，阻止冒泡元素必须包含在事件绑定元素中
          if (stopBubbleEl === this._el || !this._el?.contains(stopBubbleEl)) continue

          // 触发祖先元素事件的元素是阻止冒泡元素或被包含在阻止冒泡元素中, 不执行该事件
          if (stopBubbleEl === triggerEl || stopBubbleEl.contains(triggerEl)) {
            isStop = true
          }
        }
      }

      // 阻止冒泡
      if (isStop) return

      const touchInput: TouchInputType = e

      const eventsCallbacks = this._eventCallbackMap?.get(eventName)

      if (!eventsCallbacks) return

      for (let i = 0; i < eventsCallbacks.length; i++) {
        eventsCallbacks[i](touchInput)
      }
    })
  }

  public reWriteGestureConfig(gesture: GestureType, config: GestureOptionsType) {
    if (!this._hammerManager || !this._gestureConfigMap) {
      console.error('touch instance was destroyed.')
      return
    }

    const recognizer = this._hammerManager.get(gesture)

    let configCache = this._gestureConfigMap.get(gesture)

    // 缓存配置
    if (!configCache) {
      configCache = config
      this._gestureConfigMap.set(gesture, configCache)
    } else {
      Object.assign(configCache, config)
    }

    const { recognizeWith, requireFailure, ...otherConfig } = configCache

    // 设置当前手势与其他手势一起识别
    if (recognizeWith) {
      if (Array.isArray(recognizeWith)) {
        recognizeWith.forEach((recognizeWithGesture) => recognizer.recognizeWith(recognizeWithGesture))
      } else {
        recognizer.recognizeWith(recognizeWith)
      }
    }

    // 设置当前手势不与其他手势一起识别
    if (requireFailure) {
      if (Array.isArray(requireFailure)) {
        requireFailure.forEach((requireFailureGesture) => recognizer.requireFailure(requireFailureGesture))
      } else {
        recognizer.requireFailure(requireFailure)
      }
    }

    recognizer.set(otherConfig)
  }

  public addEventListener(
    eventName: GestureEventType,
    callback: GestureEventCallbackType,
    options?: GestureEventOptionsType
  ) {
    if (!this._hammerManager || !this._eventCallbackMap) {
      console.error('touch instance was destroyed.')
      return
    }

    let callbackList = this._eventCallbackMap.get(eventName)

    if (!callbackList) {
      callbackList = []
      this._eventCallbackMap.set(eventName, callbackList)

      // 第一次绑定事件
      this.bindEventCallback(eventName)
    }

    const index = callbackList.findIndex((fn) => fn === callback)

    if (index !== -1) return

    callbackList.push(callback)

    // 配置是否冒泡
    const { bubble = true } = options || {}

    // 不冒泡
    if (!bubble) {
      let set = stopBubbleMap.get(eventName)

      if (!set) {
        set = new Set()
        stopBubbleMap.set(eventName, set)
      }

      if (!this._el) {
        console.error('touch: lose binding element.')
        return
      }

      set.add(this._el)
    }
  }

  public removeEventListener(eventName: GestureEventType, callback: GestureEventCallbackType) {
    if (!this._hammerManager || !this._eventCallbackMap) {
      console.error('touch instance was destroyed.')
      return
    }

    const callbackList = this._eventCallbackMap.get(eventName)

    if (!callbackList) {
      return
    }

    const index = callbackList.findIndex((fn) => fn === callback)

    if (index === -1) return

    callbackList.splice(index, 1)

    if (callbackList.length === 0) {
      if (this._el) {
        stopBubbleMap.get(eventName)?.delete(this._el)
      } else {
        console.error('touch: lose binding element.')
      }
    }
  }

  public clearEventListener(eventName: GestureEventType) {
    if (!this._hammerManager || !this._eventCallbackMap) {
      console.error('touch instance was destroyed.')
      return
    }

    this._hammerManager.off(eventName)

    if (this._el) {
      stopBubbleMap.get(eventName)?.delete(this._el)
    } else {
      console.error('touch: lose binding element.')
    }

    this._eventCallbackMap.delete(eventName)
  }

  public isEventListenerExist(eventName: GestureEventType, callback: GestureEventCallbackType) {
    if (!this._hammerManager || !this._eventCallbackMap) {
      console.error('touch instance was destroyed.')
      return false
    }

    const callbackList = this._eventCallbackMap.get(eventName)

    if (!callbackList) return false

    const index = callbackList.findIndex((fn) => fn === callback)

    if (index !== -1) {
      return true
    }

    return false
  }

  public clearAllEventListener() {
    if (!this._hammerManager || !this._eventCallbackMap) {
      console.error('touch instance was destroyed.')
      return
    }

    if (!this._hammerManager) {
      console.error('touch: lose hammer manager instance.')
      return
    }

    for (const eventName of this._eventCallbackMap.keys()) {
      this._hammerManager.off(eventName)

      if (this._el) {
        stopBubbleMap.get(eventName)?.delete(this._el)
      } else {
        console.error('touch: lose binding element.')
      }
    }

    this._eventCallbackMap.clear()
  }

  public destroy() {
    if (this._isDestroyed) return

    this.clearAllEventListener()

    this._el && (this._el = null)

    if (this._hammerManager) {
      this._hammerManager.stop(true)
      this._hammerManager.destroy()
    }

    this._eventCallbackMap = null

    this._gestureConfigMap?.clear()
    this._gestureConfigMap = null

    this._hammerManager = null

    this._isDestroyed = true
  }
}

export default Touch
