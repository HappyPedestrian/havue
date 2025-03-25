export type EventKey = string | symbol

export type EventHandler<T extends (...args: any) => void> = (...args: Parameters<T>) => void

export type EventHandlerSet<T extends (...args: any) => void> = Set<EventHandler<T>>

export type EventMap<Events extends Record<EventKey, (...args: any) => void>> = Map<
  keyof Events,
  EventHandlerSet<Events[keyof Events]>
>

export class EventBus<Events extends Record<EventKey, (...args: any) => void>> {
  private _eventMap: EventMap<Events>

  constructor() {
    this._eventMap = new Map()
  }

  public on<T extends keyof Events>(key: T, handler: Events[T]): void {
    const handlers = this._eventMap.get(key)

    if (handlers) {
      handlers.add(handler)
    } else {
      const set: EventHandlerSet<Events[keyof Events]> = new Set()
      set.add(handler)
      this._eventMap.set(key, set)
    }
  }

  public off<T extends keyof Events>(key: T, handler?: Events[T]): void {
    const handlers = this._eventMap.get(key)

    if (!handlers) return

    if (handler) {
      handlers.delete(handler)
    } else {
      handlers.clear()
    }
  }

  public emit<T extends keyof Events>(key: T, ...payload: Parameters<Events[T]>): void {
    const handlers = this._eventMap.get(key)

    if (!handlers) return

    for (const callback of handlers.values()) {
      callback(...payload)
    }
  }
}
