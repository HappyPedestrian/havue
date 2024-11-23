import type { MaybeRef } from 'vue'
import { ref, computed, isRef, toValue, onBeforeUnmount } from 'vue'
import { useTouchEvent } from '@/plugins/touch/hooks'

const IS_LOG_DEBUG_INFO = true
// #region typedefine
export type TargetRectType = {
  width: number
  height: number
}

export type TargetPositionType = {
  x: number
  y: number
}

export type PinchStartInfoType = {
  position: TargetPositionType
  scale: number
}

export type PanStartInfoType = {
  position: TargetPositionType
}

export type PanMoveEventParamsType = {
  start: TargetPositionType
  current: TargetPositionType
}

export type PanStartEventParamsType = Omit<PanMoveEventParamsType, 'current'>

export type PinchMoveEventParamsType = {
  start: PinchStartInfoType
  current: PinchStartInfoType
}

export type PinchStartEventParamsType = Omit<PinchMoveEventParamsType, 'current'>

export type EventOptions = {
  onTap: (e: TargetPositionType) => void
  onDoubleTap: (e: TargetPositionType) => void
  onTap2: (e: TargetPositionType) => void
  onPanStart: (e: Omit<PanMoveEventParamsType, 'current'>) => void
  onPanMove: (e: PanMoveEventParamsType) => void
  onPanEnd: (e: PanMoveEventParamsType) => void
  onPan2Start: (e: Omit<PanMoveEventParamsType, 'current'>) => void
  onPan2Move: (e: PanMoveEventParamsType) => void
  onPan2End: (e: PanMoveEventParamsType) => void
  // onPinchStart: (e: Omit<PinchMoveEventParamsType, 'current'>) => void
  // onPinchMove: (e: PinchMoveEventParamsType) => void
  // onPinchEnd: (e: PinchMoveEventParamsType) => void
}

// #endregion typedefine

export function useOperateTransform(
  targetRect: MaybeRef<TargetRectType>,
  target: MaybeRef<HTMLElement | undefined> = ref<HTMLElement | undefined>(),
  options?: Partial<EventOptions>
) {
  /** 正在缩放 */
  const isPinching = ref(false)
  /** 正在双指拖动 */
  const isPaning = ref(false)
  /** 缩放起始信息 */
  const pinchStartInfo = ref<PinchStartInfoType>()
  /** 双指拖动起始信息 */
  const panStartInfo = ref<PanStartInfoType>()
  /** 双指拖动起始信息 */
  const pan2StartInfo = ref<PanStartInfoType>()
  /** 目标元素 */
  const operateBoxRef = computed(() => {
    return isRef(target) ? toValue(target) : target
  })

  /** 信号源实际宽高 */
  const rect = computed<TargetRectType>(() => {
    return isRef(targetRect) ? toValue(targetRect) : targetRect
  })

  const { destroy } = useTouchEvent(operateBoxRef, {
    tap: {
      handler: handleTap
    },
    doubletap: {
      handler: handleDoubleTap
    },
    tap2: {
      handler: handleTap2
    },
    // pinchstart: {
    //   handler: handlePinchStart
    // },
    // pinchmove: {
    //   handler: handlePinchMove
    // },
    // pinchend: {
    //   handler: handlePinchEnd
    // },
    panstart: {
      handler: handlePanStart
    },
    panmove: {
      handler: handlePanMove
    },
    panend: {
      handler: handlePanEnd
    },
    pan2start: {
      handler: handlePan2Start
    },
    pan2move: {
      handler: handlePan2Move
    },
    pan2end: {
      handler: handlePan2End
    }
  })

  /** 单指 点击 */
  function handleTap(e: HammerInput) {
    if (!operateBoxRef.value) {
      return
    }
    const { x, y } = e.center
    const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
    IS_LOG_DEBUG_INFO && console.log('tap:', pos, e)
    options?.onTap && options.onTap(pos)
  }

  /** 单指 点击 */
  function handleDoubleTap(e: HammerInput) {
    if (!operateBoxRef.value) {
      return
    }
    const { x, y } = e.center
    const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
    IS_LOG_DEBUG_INFO && console.log('doubletap:', pos, e)
    options?.onDoubleTap && options.onDoubleTap(pos)
  }

  /** 双指 点击 */
  function handleTap2(e: HammerInput) {
    if (!operateBoxRef.value) {
      return
    }
    const { x, y } = e.center
    const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
    IS_LOG_DEBUG_INFO && console.log('tap2:', pos, e)
    options?.onTap2 && options.onTap2(pos)
  }

  // /** 缩放开始 */
  // function handlePinchStart(e: HammerInput) {
  //   IS_LOG_DEBUG_INFO && console.log('pinchstart:', !!pan2StartInfo.value, isPaning.value)
  //   if (!operateBoxRef.value) {
  //     return
  //   }
  //   const { x, y } = e.center
  //   const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
  //   // 记录初始状态
  //   pinchStartInfo.value = {
  //     position: pos,
  //     scale: e.scale
  //   }
  //   IS_LOG_DEBUG_INFO && console.log('pinchstart:', pos, e)
  // }

  // /** 缩放中 */
  // function handlePinchMove(e: HammerInput) {
  //   IS_LOG_DEBUG_INFO && console.log('pinchmove:', !!pan2StartInfo.value, isPaning.value, e.scale)
  //   if (!pinchStartInfo.value) {
  //     return
  //   }
  //   // 正在双指拖动中，重置缩放状态
  //   if (isPaning.value) {
  //     resetPinchState()
  //     return
  //   }
  //   // 忽略缩放小于0.05的
  //   if (
  //     !isPinching.value &&
  //     Math.abs(e.scale - pinchStartInfo.value.scale) < 0.05 &&
  //     (Math.abs(e.center.x - pinchStartInfo.value.position.x) > 10 ||
  //       Math.abs(e.center.y - pinchStartInfo.value.position.y) > 10)
  //   ) {
  //     return
  //   }
  //   if (!operateBoxRef.value) {
  //     return
  //   }
  //   const isStart = !isPinching.value
  //   isPinching.value = true
  //   const { x, y } = e.center
  //   const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
  //   if (isStart) {
  //     const startInfo = pinchStartInfo.value
  //     Promise.resolve(
  //       options?.onPinchStart &&
  //         options.onPinchStart({
  //           start: startInfo
  //         })
  //     ).then(() => {
  //       options?.onPinchMove &&
  //         options.onPinchMove({
  //           start: startInfo,
  //           current: {
  //             position: pos,
  //             scale: e.scale
  //           }
  //         })
  //     })
  //   } else {
  //     options?.onPinchMove &&
  //       options.onPinchMove({
  //         start: pinchStartInfo.value,
  //         current: {
  //           position: pos,
  //           scale: e.scale
  //         }
  //       })
  //   }
  //   IS_LOG_DEBUG_INFO && console.log('pinchmove:', pos, e.scale)
  // }

  // /** 缩放结束 */
  // function handlePinchEnd(e: HammerInput) {
  //   IS_LOG_DEBUG_INFO && console.log('pinchend:', !!pan2StartInfo.value, isPaning.value)
  //   if (!pinchStartInfo.value || isPaning.value || !operateBoxRef.value) {
  //     resetPinchState()
  //     return
  //   }
  //   const { x, y } = e.center
  //   const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
  //   options?.onPinchEnd &&
  //     options.onPinchEnd({
  //       start: pinchStartInfo.value,
  //       current: {
  //         position: pos,
  //         scale: e.scale
  //       }
  //     })
  //   resetPinchState()
  //   IS_LOG_DEBUG_INFO && console.log('pinchend:', pos, e)
  // }

  // /** 重置缩放数据 */
  // function resetPinchState() {
  //   isPinching.value = false
  //   pinchStartInfo.value = undefined
  // }

  /** 双指 拖动 开始 */
  function handlePan2Start(e: HammerInput) {
    IS_LOG_DEBUG_INFO && console.log('pan2start:', !!pinchStartInfo.value, isPinching.value)
    if (!operateBoxRef.value) {
      return
    }
    const { x, y } = e.center
    const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
    // 记录初始状态
    pan2StartInfo.value = {
      position: pos
    }
    IS_LOG_DEBUG_INFO && console.log('pan2start:', pos, e)
  }

  /** 双指 拖动 中 */
  function handlePan2Move(e: HammerInput) {
    IS_LOG_DEBUG_INFO && console.log('pan2move:', !!pinchStartInfo.value, isPinching.value)
    if (!pan2StartInfo.value) {
      return
    }
    // 正在缩放中，重置拖动状态
    if (isPinching.value) {
      resetPan2State()
      return
    }
    // 忽略移动小于10的拖动
    if (
      !isPaning.value &&
      Math.abs(e.center.x - pan2StartInfo.value.position.x) < 10 &&
      Math.abs(e.center.y - pan2StartInfo.value.position.y) < 10
    ) {
      return
    }
    if (!operateBoxRef.value) {
      return
    }
    const isStart = !isPaning.value
    isPaning.value = true
    const { x, y } = e.center
    const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
    if (isStart) {
      const startPos = pan2StartInfo.value.position
      Promise.resolve(
        options?.onPan2Start &&
          options.onPan2Start({
            start: startPos
          })
      ).then(
        () =>
          options?.onPan2Move &&
          options.onPan2Move({
            start: startPos,
            current: pos
          })
      )
    } else {
      options?.onPan2Move &&
        options.onPan2Move({
          start: pan2StartInfo.value.position,
          current: pos
        })
    }
    IS_LOG_DEBUG_INFO && console.log('pan2move:', pos, e)
  }

  /** 双指 拖动 结束 */
  function handlePan2End(e: HammerInput) {
    IS_LOG_DEBUG_INFO && console.log('pan2end:', !!pinchStartInfo.value, isPinching.value)
    if (!isPaning.value || !pan2StartInfo.value || !operateBoxRef.value) {
      resetPan2State()
      return
    }
    const { x, y } = e.center
    const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
    IS_LOG_DEBUG_INFO && console.log('pan2end:', pos, e)
    options?.onPan2End &&
      options.onPan2End({
        start: pan2StartInfo.value.position,
        current: pos
      })
    resetPan2State()
  }

  /** 清空双指拖动状态 */
  function resetPan2State() {
    isPaning.value = false
    pan2StartInfo.value = undefined
  }

  /** 单指 拖动 开始 */
  function handlePanStart(e: HammerInput) {
    if (!operateBoxRef.value) {
      return
    }
    const { x, y } = e.center
    const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
    panStartInfo.value = {
      position: pos
    }
    options?.onPanStart &&
      options.onPanStart({
        start: pos
      })
    IS_LOG_DEBUG_INFO && console.log('panstart:', pos, e)
  }

  /** 单指 拖动 中 */
  function handlePanMove(e: HammerInput) {
    if (!operateBoxRef.value || !panStartInfo.value) {
      return
    }
    const { x, y } = e.center
    const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
    options?.onPanMove &&
      options.onPanMove({
        start: panStartInfo.value.position,
        current: pos
      })
    IS_LOG_DEBUG_INFO && console.log('panmove:', pos, e)
  }

  /** 单指 拖动 结束 */
  function handlePanEnd(e: HammerInput) {
    if (!operateBoxRef.value || !panStartInfo.value) {
      return
    }
    const { x, y } = e.center
    const pos = transformMousePosToTargetPos(x, y, operateBoxRef.value, rect.value.width, rect.value.height)
    options?.onPanEnd &&
      options.onPanEnd({
        start: panStartInfo.value.position,
        current: pos
      })
    panStartInfo.value = undefined
    IS_LOG_DEBUG_INFO && console.log('panend:', pos, e)
  }

  onBeforeUnmount(() => {
    destroy()
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
