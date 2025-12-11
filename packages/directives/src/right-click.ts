import type { Directive, DirectiveBinding } from 'vue'
import type { SFCWithInstall } from '@havue/utils'
import { withInstallDirective } from '@havue/utils'

export enum MODIFIERS {
  STOP = 'stop',
  PREVENT = 'prevent',
  CAPTURE = 'capture'
}

export enum EVENTS_NAME {
  DOWN = 'down',
  UP = 'up',
  CONTEXT_MENU = 'contextmenu'
}

type EventsRecordValueType = {
  value: ((pos: MouseEvent) => void) | undefined
  stop: boolean
  prevent: boolean
  capture: boolean
}

/**
 * 处理鼠标右键按下事件
 * @param e 鼠标事件
 */
function handleMouseDown(this: RightClick, e: MouseEvent) {
  if ((e.buttons & 2) !== 0) {
    // 绑定mouseup事件监听
    this._el.addEventListener('mouseup', this._handleMouseUp, this._up?.capture)
    if (this._down) {
      applyModifiers(e, this._down)
    }
  }
}

/**
 * 处理鼠标右键松开事件
 * @param e 鼠标事件
 */
function handleMouseUp(this: RightClick, e: MouseEvent) {
  if (e.buttons === 0) {
    if (this._up) {
      applyModifiers(e, this._up)
    }
  }
  this._el.removeEventListener('mouseup', this._handleMouseUp, this._up?.capture)
}

/**
 * 处理菜单事件
 * @param e 鼠标事件
 */
function handleContextMenu(this: RightClick, e: MouseEvent) {
  if (this._contextmenu) {
    applyModifiers(e, this._contextmenu)
  }
}

type RightClickHtmlElement = HTMLElement & { __rightClick?: RightClick }

type EventListenerType = (e: MouseEvent) => void

/**
 * 应用事件修饰符并执行回调函数
 * @param e 鼠标事件
 * @param config 事件配置
 */
function applyModifiers(e: MouseEvent, config: EventsRecordValueType) {
  if (config.prevent) {
    e.preventDefault()
  }
  if (config.stop) {
    e.stopPropagation()
  }
  if (config.value) {
    config.value(e)
  }
}

class RightClick {
  _el: RightClickHtmlElement
  _up: EventsRecordValueType | undefined
  _down: EventsRecordValueType | undefined
  _contextmenu: EventsRecordValueType | undefined

  _handleMouseDown: EventListenerType
  _handleMouseUp: EventListenerType
  _handleContextMenu: EventListenerType

  constructor(el: HTMLElement) {
    this._el = el as RightClickHtmlElement
    this._handleMouseDown = handleMouseDown.bind(this)
    this._handleMouseUp = handleMouseUp.bind(this)
    this._handleContextMenu = handleContextMenu.bind(this)
    el.addEventListener('mousedown', this._handleMouseDown)
    el.addEventListener('contextmenu', this._handleContextMenu)
  }

  updateEventConfig(
    type: EVENTS_NAME,
    value: EventsRecordValueType['value'],
    config: { stop: boolean; prevent: boolean; capture: boolean }
  ) {
    const { stop, prevent, capture } = config
    switch (type) {
      case EVENTS_NAME.DOWN: {
        const oldCapture = this._down?.capture
        this._down = {
          value,
          stop,
          prevent,
          capture
        }
        if (oldCapture !== capture) {
          this._el.removeEventListener('mousedown', this._handleMouseDown, oldCapture)
          this._el.addEventListener('mousedown', this._handleMouseDown, capture)
        }
        break
      }
      case EVENTS_NAME.UP: {
        this._up = {
          value,
          stop,
          prevent,
          capture
        }
        break
      }
      case EVENTS_NAME.CONTEXT_MENU: {
        const oldCapture = this._contextmenu?.capture
        this._contextmenu = {
          value,
          stop,
          prevent,
          capture
        }
        if (oldCapture !== capture) {
          this._el.removeEventListener('contextmenu', this._handleContextMenu, oldCapture)
          this._el.addEventListener('contextmenu', this._handleContextMenu, capture)
        }
        break
      }
    }
  }

  destroy() {
    this._el.__rightClick && delete this._el.__rightClick

    // 移除事件监听器，确保使用正确的 capture 参数
    this._el.removeEventListener('mousedown', this._handleMouseDown, this._down?.capture)
    this._el.removeEventListener('contextmenu', this._handleContextMenu, this._contextmenu?.capture)
    this._el.removeEventListener('mouseup', this._handleMouseUp, this._up?.capture)
  }
}

const supportedEventNames = [EVENTS_NAME.DOWN, EVENTS_NAME.UP, EVENTS_NAME.CONTEXT_MENU]

const RightClickDirective: Directive = {
  mounted: bindEvent,

  updated: bindEvent,

  beforeUnmount(el: RightClickHtmlElement) {
    el.__rightClick?.destroy()
  }
}

/** 绑定事件 */
function bindEvent(el: RightClickHtmlElement, binding: DirectiveBinding<((e?: MouseEvent) => void) | undefined>) {
  const { arg: eventName, modifiers, value } = binding

  if (!eventName) {
    console.error(
      '[HvRightClickDirective] Error: An event name must be specified for the right-click directive, for example, v-right-click:up, v-right-click:down, or v-right-click:contextmenu.'
    )
    return
  }
  if (!supportedEventNames.includes(eventName as EVENTS_NAME)) {
    console.error(
      `[HvRightClickDirective] Error: Unsupported event name "${eventName}".Supported events are: ${supportedEventNames.join(', ')}`
    )
    return
  }

  if (!el.__rightClick) {
    el.__rightClick = new RightClick(el)
  }

  el.__rightClick.updateEventConfig(eventName as EVENTS_NAME, value, {
    stop: modifiers[MODIFIERS.STOP],
    prevent: modifiers[MODIFIERS.PREVENT],
    capture: modifiers[MODIFIERS.CAPTURE]
  })
}

export const HvRightClickDirective: SFCWithInstall<typeof RightClickDirective> = withInstallDirective(
  RightClickDirective,
  'right-click'
)

export default HvRightClickDirective
