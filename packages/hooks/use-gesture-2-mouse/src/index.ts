import type { MaybeRef } from 'vue'
import { ref, computed, watch, isRef, toValue, onBeforeUnmount } from 'vue'
import { isMobile } from '@pedy/shared'
import throttle from 'lodash/throttle'

// #region typedefine
export type UseGestrue2MouseTargetRealSizeType = {
  width: number
  height: number
}

export type UseGestrue2MouseTargetPositionType = {
  x: number
  y: number
}

export type UseGestrue2MouseMouseButtonType = 'left' | 'right' | 'middle'

export type UseGestrue2MouseEventOptions = {
  onMouseEvent: (e: UseGestrue2MouseTargetPositionType, button?: UseGestrue2MouseMouseButtonType) => void
  onMouseWheel: (e: UseGestrue2MouseTargetPositionType, deltaY: number) => void
  throttle?: {
    wait: number
    leading?: boolean
    trailing?: boolean
  }
}
// #endregion typedefine

export function useGestrue2Mouse(
  TargetRealSize: MaybeRef<UseGestrue2MouseTargetRealSizeType>,
  target: MaybeRef<HTMLElement | undefined>,
  options?: Partial<UseGestrue2MouseEventOptions>
) {
  /** 目标元素 */
  let operateBoxRef = ref<HTMLElement>()
  if (target) {
    operateBoxRef = computed(() => {
      return isRef(target) ? toValue(target) : target
    })
  }

  /** 信号源实际宽高 */
  const rect = computed<UseGestrue2MouseTargetRealSizeType>(() => {
    return isRef(TargetRealSize) ? toValue(TargetRealSize) : TargetRealSize
  })

  const isThrottleMoveEvent = typeof options?.throttle === 'object'

  const _throttleOptions = computed(() => {
    const throttleOptions = options?.throttle || {}
    return Object.assign(
      {
        wait: 0,
        leading: true,
        trailing: false
      },
      throttleOptions
    )
  })

  /** 当初touch操作类型，single：单指，double：双指 */
  let touchType: 'single' | 'double' | undefined = undefined
  /** 触发touchmove事件的次数 */
  let touchMovingCount: number = 0
  /** touchstart开始的点 */
  let touchStartPos: UseGestrue2MouseTargetPositionType | undefined = undefined
  /** 上传识别为相关操作（拖动，点击），的点 */
  let lastTouchPos: UseGestrue2MouseTargetPositionType | undefined = undefined
  /** 重置 lastTouchPos值得timeout*/
  let resetLastTouchPosTimer: number | null = null

  function handleTouchStart(e: TouchEvent) {
    resetLastTouchPosTimer && clearTimeout(resetLastTouchPosTimer)
    resetLastTouchPosTimer = null
    if (!operateBoxRef.value || touchMovingCount > 0) {
      return
    }
    e.preventDefault()
    document.body.addEventListener('touchmove', handleTouchMove)
    document.body.addEventListener('touchend', handleTouchEnd)
    const touchCount = e.touches.length
    touchType = touchCount === 1 ? 'single' : touchCount === 2 ? 'double' : undefined
    switch (touchType) {
      case 'single': {
        const { clientX, clientY } = e.touches[0]
        const pos = transformMousePosToTargetPos(
          clientX,
          clientY,
          operateBoxRef.value,
          rect.value.width,
          rect.value.height
        )
        if (lastTouchPos && Math.abs(lastTouchPos.x - pos.x) < 30 && Math.abs(lastTouchPos.y - pos.y) < 30) {
          // 如果lastTouchPos有值，且范围小于30以内，认为是双击的第二次点击，
          // 设置touchStartPos为lastTouchPos
          // 因为双击如果两次的点不一样，打不开电脑的文件夹
          touchStartPos = lastTouchPos
        } else {
          touchStartPos = pos
          lastTouchPos = pos
        }
        break
      }
      case 'double': {
        const [{ clientX: x1, clientY: y1 }, { clientX: x2, clientY: y2 }] = e.touches
        const x = (x1 + x2) / 2
        const y = (y1 + y2) / 2
        const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
        touchStartPos = pos
        lastTouchPos = pos
        break
      }
    }
  }
  const touchMoveFn = (e: TouchEvent) => {
    if (!operateBoxRef.value) {
      return
    }
    switch (touchType) {
      case 'single': {
        const { clientX, clientY } = e.touches[0]
        const pos = transformMousePosToTargetPos(
          clientX,
          clientY,
          operateBoxRef.value,
          rect.value.width,
          rect.value.height
        )
        lastTouchPos = pos
        options?.onMouseEvent && options.onMouseEvent(pos, 'left')
        break
      }
      case 'double': {
        const [{ clientX: x1, clientY: y1 }, { clientX: x2, clientY: y2 }] = e.touches
        const x = (x1 + x2) / 2
        const y = (y1 + y2) / 2
        const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
        let deltaY = 0
        if (lastTouchPos) {
          deltaY = lastTouchPos.y - pos.y
        }
        lastTouchPos = pos
        options?.onMouseWheel && options.onMouseWheel(touchStartPos!, deltaY)
        break
      }
    }
  }

  const onTouchMove = isThrottleMoveEvent
    ? throttle(touchMoveFn, _throttleOptions.value.wait || 0, {
        leading: _throttleOptions.value.leading,
        trailing: _throttleOptions.value.trailing
      })
    : touchMoveFn

  function handleTouchMove(e: TouchEvent) {
    e.preventDefault()
    if (!touchType || !operateBoxRef.value) {
      return
    }
    touchMovingCount++
    onTouchMove(e)
  }

  function handleTouchEnd() {
    document.body.removeEventListener('touchmove', handleTouchMove)
    document.body.removeEventListener('touchend', handleTouchEnd)
    if (!operateBoxRef.value) {
      return
    }
    if (lastTouchPos) {
      const pos = lastTouchPos
      switch (touchType) {
        case 'single': {
          if (touchMovingCount <= 2) {
            // 没有触发touchmove或者触发touchmove次数小于等于2，认为是点击
            Promise.resolve(options?.onMouseEvent && options.onMouseEvent(pos, 'left')).then(
              () => options?.onMouseEvent && options.onMouseEvent(pos)
            )
          } else {
            options?.onMouseEvent && options.onMouseEvent(pos)
          }
          break
        }
        case 'double': {
          if (touchMovingCount <= 2) {
            // 没有触发touchmove或者触发touchmove次数小于等于2，认为是右键
            Promise.resolve(options?.onMouseEvent && options.onMouseEvent(pos, 'right')).then(
              () => options?.onMouseEvent && options.onMouseEvent(pos)
            )
          } else {
            options?.onMouseEvent && options.onMouseEvent(pos)
          }
          break
        }
      }
    }

    touchMovingCount = 0
    touchType = undefined
    touchStartPos = undefined
    resetLastTouchPosTimer = setTimeout(() => {
      lastTouchPos = undefined
      resetLastTouchPosTimer = null
    }, 300)
  }

  let isMouseDown = false
  function handleMouseDown(e: MouseEvent) {
    e.preventDefault()
    if (!operateBoxRef.value) {
      return
    }
    document.body.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseup', handleMouseUp)
    isMouseDown = true
    handleMouseEvent(e)
  }

  const mouseMoveFn = handleMouseEvent

  const onMouseMove = isThrottleMoveEvent
    ? throttle(mouseMoveFn, _throttleOptions.value.wait, {
        leading: _throttleOptions.value.leading,
        trailing: _throttleOptions.value.trailing
      })
    : mouseMoveFn

  function handleMouseMove(e: MouseEvent) {
    if (!operateBoxRef.value || !isMouseDown) {
      return
    }
    onMouseMove(e)
  }

  function handleMouseUp(e: MouseEvent) {
    document.body.removeEventListener('mousemove', handleMouseMove)
    document.body.removeEventListener('mouseup', handleMouseUp)

    if (!operateBoxRef.value) {
      return
    }
    isMouseDown = false
    handleMouseEvent(e)
  }

  function handleMouseEvent(e: MouseEvent) {
    if (!operateBoxRef.value) {
      return
    }
    const { clientX, clientY } = e
    const pos = transformMousePosToTargetPos(clientX, clientY, operateBoxRef.value, rect.value.width, rect.value.height)

    if ((e.buttons & 2) !== 0) {
      // 右键按下
      e.preventDefault()
      options?.onMouseEvent && options.onMouseEvent(pos, 'right')
    } else if ((e.buttons & 1) !== 0) {
      // 左键按下
      options?.onMouseEvent && options.onMouseEvent(pos, 'left')
    } else if ((e.buttons & 4) !== 0) {
      // 中键按下
      options?.onMouseEvent && options.onMouseEvent(pos, 'middle')
    } else {
      options?.onMouseEvent && options.onMouseEvent(pos)
    }
  }

  /** 鼠标滚轮事件 */
  function handleWheel(e: WheelEvent) {
    e.preventDefault()
    if (!operateBoxRef.value) {
      return
    }
    const { clientX, clientY } = e
    const pos = transformMousePosToTargetPos(clientX, clientY, operateBoxRef.value, rect.value.width, rect.value.height)

    Promise.resolve(options?.onMouseEvent && options.onMouseEvent(pos))
      .then(() => options?.onMouseWheel && options.onMouseWheel(pos, e.deltaY))
      .then(() => {
        options?.onMouseEvent && options.onMouseEvent(pos)
      })
  }

  /** 阻止默认行为 */
  function preventDefaultEvent(event: MouseEvent) {
    event.preventDefault()
  }

  watch(
    () => operateBoxRef.value,
    () => {
      if (!operateBoxRef.value) {
        return
      }
      if (isMobile) {
        operateBoxRef.value.addEventListener('touchstart', handleTouchStart)
      } else {
        operateBoxRef.value.addEventListener('mousedown', handleMouseDown)

        operateBoxRef.value.addEventListener('wheel', handleWheel)
        operateBoxRef.value.addEventListener('contextmenu', preventDefaultEvent)
      }
    }
  )

  onBeforeUnmount(() => {
    if (!operateBoxRef.value) {
      return
    }
    if (isMobile) {
      operateBoxRef.value.removeEventListener('touchstart', handleTouchStart)
      document.body.removeEventListener('touchmove', handleTouchMove)
      document.body.removeEventListener('touchend', handleTouchEnd)
    } else {
      operateBoxRef.value.removeEventListener('mousedown', handleMouseDown)
      document.body.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseup', handleMouseUp)

      operateBoxRef.value.removeEventListener('wheel', handleWheel)
      operateBoxRef.value.removeEventListener('contextmenu', preventDefaultEvent)
    }
  })

  return {
    operateBoxRef
  }
}

/**
 * 返回在页面元素中的位置 对应 目标屏幕区域中的位置
 * @param x 鼠标x
 * @param y 鼠标y
 * @param el 透传区域元素
 * @param targetWidth 目标透传区域实际宽度
 * @param targetHeight 目标透传区域实际高度
 * @returns { UseGestrue2MouseTargetPositionType }
 */
function transformMousePosToTargetPos(
  x: number,
  y: number,
  el: HTMLElement,
  targetWidth: number,
  targetHeight: number
): UseGestrue2MouseTargetPositionType {
  const rect = el?.getBoundingClientRect()
  if (!rect) {
    return { x: 0, y: 0 }
  }
  const { top, left, width: elWidth, height: elHeight } = rect
  /** 在元素中横坐标 */
  let elX = x
  /** 在元素中纵坐标 */
  let elY = y

  elX = x < left ? 0 : x > left + elWidth ? elWidth : x - left
  elY = y < top ? 0 : y > top + elHeight ? elHeight : y - top

  // 计算透传实际宽高和元素宽高的比值
  const scaleX = elWidth !== 0 ? targetWidth / elWidth : 0
  const scaleY = elHeight !== 0 ? targetHeight / elHeight : 0

  const targetX = elX * scaleX
  const targetY = elY * scaleY

  return {
    x: Math.round(targetX),
    y: Math.round(targetY)
  }
}
