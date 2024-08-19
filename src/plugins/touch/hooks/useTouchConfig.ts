import type { MaybeRef } from 'vue'
import type { MultiGestureOptionsType, GestureType } from '../core/touch'
import { computed, watch, isRef, toValue } from 'vue'
import Touch, { Gestures } from '../core/touch'

interface TouchHTMLElement extends HTMLElement {
  __touch?: Touch<TouchHTMLElement>
}

export function useTouchConfig(el: MaybeRef<TouchHTMLElement | null>, options?: Partial<MultiGestureOptionsType>) {
  const target = computed(() => {
    return isRef(el) ? toValue(el) : el
  })

  const multiGestureOptions = options

  let touch: Touch | undefined = undefined

  watch(
    target,
    (el) => {
      if (!el) return

      if (!multiGestureOptions) return

      touch = el.__touch
      if (!touch) {
        touch = new Touch(el)
        el.__touch = touch
      }

      for (const gesture of Object.keys(multiGestureOptions)) {
        if (!Gestures.includes(gesture as GestureType)) continue

        touch.reWriteGestureConfig(gesture as GestureType, multiGestureOptions[gesture])
      }
    },
    { immediate: true }
  )
}
