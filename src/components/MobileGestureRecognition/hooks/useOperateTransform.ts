import type { MaybeRef } from 'vue'
import { ref, computed, watch, isRef, toValue, onBeforeUnmount } from 'vue'
import { isMobile } from '@/utils/platform'
import throttle from 'lodash/throttle'

// #region typedefine
export type TargetRealSizeType = {
  width: number
  height: number
}

export type TargetPositionType = {
  x: number
  y: number
}

export type MouseButtonType = 'left' | 'right' | 'middle'

export type EventOptions = {
  onMouseEvent: (e: TargetPositionType, button?: MouseButtonType) => void
  onMouseWheel: (e: TargetPositionType, deltaY: number) => void
}
// #endregion typedefine

export function useOperateTransform(
  TargetRealSize: MaybeRef<TargetRealSizeType>,
  target: MaybeRef<HTMLElement | undefined>,
  options?: Partial<EventOptions>
) {
  /** 目标元素 */
  let operateBoxRef = ref<HTMLElement>()
  if (target) {
    operateBoxRef = computed(() => {
      return isRef(target) ? toValue(target) : target
    })
  }

  /** 信号源实际宽高 */
  const rect = computed<TargetRealSizeType>(() => {
    return isRef(TargetRealSize) ? toValue(TargetRealSize) : TargetRealSize
  })

  /** 当初touch操作类型，single：单指，double：双指 */
  let touchType: 'single' | 'double' | undefined = undefined
  /** 触发touchmove事件的次数 */
  let touchMovingCount: number = 0
  /** touchstart开始的点 */
  let touchStartPos: TargetPositionType | undefined = undefined
  /** 上传识别为相关操作（拖动，点击），的点 */
  let lastTouchPos: TargetPositionType | undefined = undefined
  /** 重置 lastTouchPos值得timeout*/
  let resetLastTouchPosTimer: number | null = null

  function handleTouchStart(e: TouchEvent) {
    resetLastTouchPosTimer && clearTimeout(resetLastTouchPosTimer)
    resetLastTouchPosTimer = null
    if (!operateBoxRef.value || touchMovingCount > 0) {
      return
    }
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

  const onTouchMove = throttle(
    (e: TouchEvent) => {
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
    },
    50,
    {
      leading: true,
      trailing: false
    }
  )

  function handleTouchMove(e: TouchEvent) {
    e.preventDefault()
    if (!touchType || !operateBoxRef.value) {
      return
    }
    touchMovingCount++
    onTouchMove(e)
  }

  function handleTouchEnd() {
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
    if (!operateBoxRef.value) {
      return
    }
    isMouseDown = true
    handleMouseEvent(e)
  }

  const onMoseMove = throttle(
    (e: MouseEvent) => {
      handleMouseEvent(e)
    },
    50,
    {
      leading: true,
      trailing: false
    }
  )

  function handleMouseMove(e: MouseEvent) {
    if (!operateBoxRef.value || !isMouseDown) {
      return
    }
    onMoseMove(e)
  }

  function handleMouseUp(e: MouseEvent) {
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
        operateBoxRef.value.addEventListener('touchmove', handleTouchMove)
        operateBoxRef.value.addEventListener('touchend', handleTouchEnd)
      } else {
        operateBoxRef.value.addEventListener('mousedown', handleMouseDown)
        operateBoxRef.value.addEventListener('mousemove', handleMouseMove)
        operateBoxRef.value.addEventListener('mouseup', handleMouseUp)

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
      operateBoxRef.value.removeEventListener('touchmove', handleTouchMove)
      operateBoxRef.value.removeEventListener('touchend', handleTouchEnd)
    } else {
      operateBoxRef.value.removeEventListener('mousedown', handleMouseDown)
      operateBoxRef.value.removeEventListener('mousemove', handleMouseMove)
      operateBoxRef.value.removeEventListener('mouseup', handleMouseUp)

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
 * @returns { TargetPositionType }
 */
function transformMousePosToTargetPos(
  x: number,
  y: number,
  el: HTMLElement,
  targetWidth: number,
  targetHeight: number
): TargetPositionType {
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
