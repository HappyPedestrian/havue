import type { Directive, DirectiveBinding } from 'vue'
import type { SFCWithInstall } from '@pedy/utils'
import { withInstallDirective } from '@pedy/utils'

export enum MODIFIERS {
  STOP = 'stop',
  PREVENT = 'prevent',
  CAPTURE = 'capture'
}

export enum EVENTS_NAME {
  DOWN = 'down',
  UP = 'up',
  CONTEXT_MEMU = 'contextmenu'
}

type EventsRecordType = {
  down: ((e: MouseEvent) => void)[]
  up: ((e: MouseEvent) => void)[]
  contextmenu: ((e: MouseEvent) => void)[]
}

const eventListenerMap = new Map<HTMLElement, EventsRecordType>()

const RightClickDirective: Directive = {
  mounted: bindEvent,

  beforeUnmount(el: HTMLElement) {
    const listeners = eventListenerMap.get(el)
    if (!listeners) {
      return
    }
    listeners.down.forEach((cb) => el.removeEventListener('mousedown', cb))
    listeners.up.forEach((cb) => el.removeEventListener('mouseup', cb))
    listeners.contextmenu.forEach((cb) => el.removeEventListener('contextmenu', cb))
    eventListenerMap.delete(el)
  }
}

function bindEvent(el: HTMLElement, binding: DirectiveBinding<(() => void) | undefined>) {
  const { arg: eventName, modifiers, value } = binding

  const isStopPropagation = modifiers[MODIFIERS.STOP] ? true : false
  const isPreventDefault = modifiers[MODIFIERS.PREVENT] ? true : false
  const isCapture = modifiers[MODIFIERS.CAPTURE] ? true : false

  const eventRecord: EventsRecordType = eventListenerMap.get(el) || {
    down: [],
    up: [],
    contextmenu: []
  }
  if (typeof eventName !== 'string') {
    return
  }
  switch (eventName) {
    case EVENTS_NAME.DOWN: {
      const listener = createEventListener(isStopPropagation, isPreventDefault, value, 2)
      eventRecord.down.push(listener)
      el.addEventListener('mousedown', listener, isCapture)
      break
    }
    case EVENTS_NAME.UP: {
      const onDown = createEventListener(
        isStopPropagation,
        isPreventDefault,
        () => {
          const onUp = createEventListener(
            isStopPropagation,
            isPreventDefault,
            () => {
              const index = eventRecord.up.indexOf(onUp)
              el.removeEventListener('mouseup', eventRecord.up[index])
              eventRecord.up.splice(index, 1)

              value && value()
            },
            0
          )
          eventRecord.up.push(onUp)
          el.addEventListener('mouseup', onUp, isCapture)
        },
        2
      )
      eventRecord.down.push(onDown)
      el.addEventListener('mousedown', onDown)
      break
    }
    case EVENTS_NAME.CONTEXT_MEMU: {
      const listener = createEventListener(isStopPropagation, isPreventDefault, value, 0)
      eventRecord.contextmenu.push(listener)
      el.addEventListener('contextmenu', listener, { capture: isCapture })
      break
    }
  }

  eventListenerMap.set(el, eventRecord)
}

function createEventListener(
  stop: boolean,
  prevent: boolean,
  value: (() => void) | undefined,
  targetButtons: number = 0
) {
  return (e: MouseEvent) => {
    if (targetButtons === e.buttons || (e.buttons & targetButtons) !== 0) {
      prevent ? e.preventDefault() : null
      stop ? e.stopPropagation() : null
      value && value()
    }
  }
}

export const PdRightClickDirective: SFCWithInstall<typeof RightClickDirective> = withInstallDirective(
  RightClickDirective,
  'right-click'
)

export default PdRightClickDirective
