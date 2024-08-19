import type { MaybeRef } from 'vue'
import type { GestureEventType, GestureEventCallbackType } from '../core/touch'
import { computed, watch, isRef, toValue } from 'vue'
import Touch from '../core/touch'

interface TouchHTMLElement extends HTMLElement {
	__touch?: Touch<TouchHTMLElement>
}

type GestureEventOptionsType = {
	handler: GestureEventCallbackType | GestureEventCallbackType[]
	config?: {
		stopPropagation: boolean
	}
}

export function useTouchEvent(el: MaybeRef<TouchHTMLElement | null>, options?: Partial<Record<GestureEventType, GestureEventOptionsType>>) {
	const target = computed(() => {
		return isRef(el) ? toValue(el) : el
	})

	const events = options

	let touch: Touch | undefined = undefined
	watch(
		target,
		(el) => {
			if (!el) return

			touch = el.__touch
			if (!touch) {
				touch = new Touch(el)
				el.__touch = touch
			}

			if (!events) return

			const eventNameList = Object.keys(events) as GestureEventType[]

			for (let i = 0; i < eventNameList.length; i++) {
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
		},
		{ immediate: true }
	)

	const removeEvent = (eventName: GestureEventType, handler: GestureEventCallbackType) => {
		touch?.removeEventListener(eventName, handler)
	}

	const clearEvents = (eventName: GestureEventType) => {
		touch?.clearEventListener(eventName)
	}

	const destroyTouch = () => {
		touch?.destroy()

		target.value?.__touch && delete target.value?.__touch
	}

	return {
		remove: removeEvent,
		clear: clearEvents,
		destroy: destroyTouch,
	}
}
