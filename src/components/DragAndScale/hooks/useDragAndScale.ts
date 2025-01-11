import type { MaybeRef } from 'vue'
import { computed, isRef, watch, toValue, onBeforeUnmount } from 'vue'
import { isMobile } from '@/utils/platform'

export type UseDragAndScaleOptions = {
  container: HTMLElement
  containerRealSize?: {
    width: number
    height: number
  }
  scaleAreaWidth?: number
  keepRatio?: boolean | KeepRatioType
  limit?: {
    minWidth: number
    minHeight: number
  }
  disabled?: boolean
  onChange?: (p: ChangeResultType) => void
  onFinish?: () => void
}

type KeepRatioType = {
  enable: boolean
  scaleCase: 'min' | 'max'
}

enum KeepRatioCaseEnum {
  MIN = 'min',
  MAX = 'max'
}

export type Point = {
  x: number
  y: number
}

type TargetAreaType = {
  elX: number
  elY: number
  elWidth: number
  elHeight: number
}

export type ChangeResultType = TargetAreaType & {
  realX: number
  realY: number
  realWidth: number
  realHeight: number
}

type EffectDirectionType = {
  leftSide: boolean
  rightSide: boolean
  topSide: boolean
  bottomSide: boolean
  center: boolean
}

export function useDragAndScale(
  target: MaybeRef<HTMLElement>,
  operateTarget: MaybeRef<HTMLElement>,
  options: MaybeRef<UseDragAndScaleOptions>
) {
  const _options = computed(() => {
    return isRef(options) ? toValue(options) : options
  })
  /** 父级容器实际对应的宽高（非页面元素宽高） */
  const _containerRealSize = computed(() => {
    return _options.value.containerRealSize
  })

  /** 保持宽高比 */
  const _keepRatio = computed<KeepRatioType>(() => {
    const krOption =
      typeof _options.value.keepRatio === 'boolean'
        ? { enable: _options.value.keepRatio, scaleCase: KeepRatioCaseEnum.MIN }
        : _options.value.keepRatio
    return Object.assign(
      {},
      {
        scaleCase: KeepRatioCaseEnum.MIN,
        enable: false
      },
      krOption || {}
    )
  })

  /** 限制缩放最小值 */
  const _limit = computed(() => {
    return Object.assign(
      {
        minWidth: 0,
        minHeight: 0
      },
      _options.value.limit || {}
    )
  })

  /** 是否禁用 */
  const _disabled = computed(() => {
    return _options.value.disabled || false
  })

  /** 缩放元素 */
  const _targetEl = computed(() => {
    return isRef(target) ? toValue(target) : target
  })
  /** 容器元素 */
  const _containerEl = computed(() => {
    return _options.value.container
  })

  /** 缩放拖拽区域元素 */
  const _operateEl = computed(() => {
    return isRef(operateTarget) ? toValue(operateTarget) : operateTarget
  })

  /** 拖动缩放起始点 */
  let startPoint: Point = {
    x: 0,
    y: 0
  }

  /** 父级容器尺寸 */
  const containerElSize = {
    width: 0,
    height: 0
  }

  /** 拖拽缩放开始时，元素的位置宽高 */
  const startArea: TargetAreaType = {
    elX: 0,
    elY: 0,
    elWidth: 0,
    elHeight: 0
  }

  /** 操作位置 */
  const effectDirection: EffectDirectionType = {
    leftSide: false,
    rightSide: false,
    topSide: false,
    bottomSide: false,
    center: false
  }

  let isOperateStart = false

  let realRateEl_w = 1
  let realRateEl_h = 1

  watch(
    () => _targetEl.value && _containerEl.value && _operateEl.value,
    (value) => {
      if (value) {
        bindEvent()
      } else {
        removeEvent()
      }
    }
  )

  function onStart(point: Point) {
    if (_disabled.value) {
      return
    }
    // 存储拖动缩放起始点
    startPoint = point

    if (!_containerEl.value || !_targetEl.value) {
      return
    }

    const {
      x: containerX,
      y: containerY,
      width: containerWidth,
      height: containerHeight
    } = _containerEl.value.getBoundingClientRect()

    Object.assign(containerElSize, {
      width: Math.round(containerWidth),
      height: Math.round(containerHeight)
    })
    // 是否需要转换 为真实大小
    if (_containerRealSize.value) {
      const { width: realWdith, height: realHeight } = _containerRealSize.value

      realRateEl_w = realWdith / containerWidth
      realRateEl_h = realHeight / containerHeight
    } else {
      realRateEl_w = 1
      realRateEl_h = 1
    }
    const { x: targetX, y: targetY, width: targetW, height: targetH } = _targetEl.value.getBoundingClientRect()

    const {
      x: operateElX,
      y: operateElY,
      width: operateElW,
      height: operateElH
    } = _operateEl.value.getBoundingClientRect()

    const { x: startX, y: startY } = point
    if (
      !(
        startX >= operateElX &&
        startX <= operateElX + operateElW &&
        startY >= operateElY &&
        startY <= operateElY + operateElH
      )
    ) {
      return
    }

    Object.assign(startArea, {
      elX: Math.round(targetX - containerX),
      elY: Math.round(targetY - containerY),
      elWidth: Math.round(targetW),
      elHeight: Math.round(targetH)
    })

    const touchEl = document.elementFromPoint(startX, startY) as HTMLElement
    if (!touchEl) {
      return
    }
    // 四个边和角、中心操作区域元素都添加了data-scale-side属性
    // 用于判断往那个方向拖动
    const sides = (touchEl.dataset['scaleSide'] || '').split(',').filter((item) => !!item)
    if (!sides.length) {
      return
    }

    // let leftSide = Math.abs(startX - targetX) < _halfScaleAreaWidth.value
    // let topSide = Math.abs(startY - targetY) < _halfScaleAreaWidth.value
    // let rightSide = Math.abs(startX - targetX - targetW) < _halfScaleAreaWidth.value
    // let bottomSide = Math.abs(startY - targetY - targetH) < _halfScaleAreaWidth.value
    // const center = !leftSide && !topSide && !rightSide && !bottomSide

    let leftSide = sides.includes('left')
    let topSide = sides.includes('top')
    let rightSide = sides.includes('right')
    let bottomSide = sides.includes('bottom')
    const center = sides.includes('center')

    isOperateStart = true

    // 保持宽高比，认为在4个角拖动
    if (_keepRatio.value.enable && !center) {
      if (startX - targetX <= targetW / 2 && startY - targetY <= targetH / 2) {
        leftSide = true
        topSide = true
      }
      if (startX - targetX > targetW / 2 && startY - targetY <= targetH / 2) {
        rightSide = true
        topSide = true
      }
      if (startX - targetX <= targetW / 2 && startY - targetY > targetH / 2) {
        leftSide = true
        bottomSide = true
      }
      if (startX - targetX > targetW / 2 && startY - targetY > targetH / 2) {
        rightSide = true
        bottomSide = true
      }
    }

    Object.assign(effectDirection, {
      leftSide,
      rightSide,
      topSide,
      bottomSide,
      center
    })
  }

  function onMove(point: Point) {
    if (_disabled.value || isOperateStart !== true) {
      return
    }
    const deltaX = point.x - startPoint.x
    const deltaY = point.y - startPoint.y
    let dX = 0
    let dY = 0
    let dW = 0
    let dH = 0

    const { elX, elY, elWidth, elHeight } = startArea
    const { minWidth, minHeight } = _limit.value

    const minElWidth = minWidth / realRateEl_w
    const minElHeight = minHeight / realRateEl_h

    if (effectDirection.center) {
      // 位置改变
      const containerWidth = containerElSize.width
      const containerHeight = containerElSize.height
      // 避免超出边界
      const distanceX =
        elX + deltaX < 0 ? -elX : elX + elWidth + deltaX > containerWidth ? containerWidth - elWidth - elX : deltaX
      const distanceY =
        elY + deltaY < 0 ? -elY : elY + elHeight + deltaY > containerHeight ? containerHeight - elHeight - elY : deltaY
      dX = distanceX
      dY = distanceY
    } else {
      // 缩放
      const { leftSide, rightSide, topSide, bottomSide } = effectDirection
      if (leftSide) {
        // 避免超出左边界
        let distance = elX + deltaX < 0 ? -elX : deltaX

        // 宽高限制
        if (elWidth - distance < minElWidth) {
          distance = elWidth - minElWidth
        }
        dX = distance
        dW = -distance
      }
      if (rightSide) {
        const containerWidth = containerElSize.width
        // 避免超出右边界
        let distance = elX + elWidth + deltaX > containerWidth ? containerWidth - elWidth - elX : deltaX

        // 宽高限制
        if (elWidth + distance < minElWidth) {
          distance = minElWidth - elWidth
        }
        dW = distance
      }
      if (topSide) {
        // 避免超出上边界
        let distance = elY + deltaY < 0 ? -elY : deltaY

        // 宽高限制
        if (elHeight - distance < minElHeight) {
          distance = elHeight - minElHeight
        }
        dY = distance
        dH = -distance
      }
      if (bottomSide) {
        const containerHeight = containerElSize.height
        // 避免超出下边界
        let distance = elY + elHeight + deltaY > containerHeight ? containerHeight - elHeight - elY : deltaY

        // 宽高限制
        if (elHeight + distance < minElHeight) {
          distance = minElHeight - elHeight
        }
        dH = distance
      }

      // 保持宽高比
      if (_keepRatio.value.enable) {
        const dwR = dW / elWidth
        const dhR = dH / elHeight

        if (
          (dwR < dhR && _keepRatio.value.scaleCase === KeepRatioCaseEnum.MIN) ||
          (dwR > dhR && _keepRatio.value.scaleCase === KeepRatioCaseEnum.MAX)
        ) {
          //当（使用x,y改变最小值）宽度改变较少
          //或（使用x,y改变最大值）高度改变较少
          dH = dwR * elHeight
          // 最小高度限制
          if (elHeight + dH < minElHeight) {
            const originDw = dW
            dH = minElHeight - elHeight
            dW = (dH / elHeight) * elWidth
            dX = dX * (dW / originDw)
          }

          // 拖动了上边，使用dH计算dY
          if (effectDirection.topSide) {
            dY = -dH
          }
        } else if (
          (dhR < dwR && _keepRatio.value.scaleCase === KeepRatioCaseEnum.MIN) ||
          (dhR > dwR && _keepRatio.value.scaleCase === KeepRatioCaseEnum.MAX)
        ) {
          //当（使用x,y改变最小值）高度改变较少
          //或（使用x,y改变最大值）宽度改变较少
          dW = dhR * elWidth
          // 最小宽度限制
          if (elWidth + dW < minElWidth) {
            const originDh = dH
            dW = minElWidth - elWidth
            dH = (dW / elWidth) * elHeight
            dY = dY * (dH / originDh)
          }

          // 拖动了左边，使用dW计算dX
          if (effectDirection.leftSide) {
            dX = -dW
          }
        }

        // 父级容器边界限制
        const currentElX = elX + dX
        const currentElY = elY + dY
        const currentElW = elWidth + dW
        const currentElH = elHeight + dH
        if (
          currentElX < 0 ||
          currentElY < 0 ||
          currentElX + currentElW > containerElSize.width ||
          currentElY + currentElH > containerElSize.height
        ) {
          // 拖动元素超出了父级容器
          // 拖动元素 在父级容器内的 区域 的左上角点
          let clipX = currentElX < 0 ? 0 : currentElX
          let clipY = currentElY < 0 ? 0 : currentElY
          // 拖动元素 在父级容器内的 区域 的宽高
          let clipW =
            currentElX + currentElW > containerElSize.width
              ? containerElSize.width - clipX
              : currentElX + currentElW - clipX
          let clipH =
            currentElY + currentElH > containerElSize.height
              ? containerElSize.height - clipY
              : currentElY + currentElH - clipY

          // 拖动元素 在父级容器内的 区域 的右下角点
          const clipX2 = clipX + clipW
          const clipY2 = clipY + clipH

          // 保持比例后，缩放区域的宽高
          const clipRate = clipW / clipH
          const elRate = elWidth / elHeight
          if (clipRate < elRate) {
            clipH = clipW / elRate
          } else if (clipRate > elRate) {
            clipW = clipH * elRate
          }

          const { topSide, leftSide } = effectDirection

          // 计算保持宽高后的左上角点
          if (leftSide) {
            clipX = clipX2 - clipW
          }
          if (topSide) {
            clipY = clipY2 - clipH
          }

          dX = clipX - elX
          dY = clipY - elY
          dW = clipW - elWidth
          dH = clipH - elHeight
        }
      }
    }

    const currentElX = Math.round(elX + dX)
    const currentElY = Math.round(elY + dY)
    const currentElW = Math.round(elWidth + dW)
    const currentElH = Math.round(elHeight + dH)

    _options.value.onChange &&
      _options.value.onChange({
        elX: currentElX,
        elY: currentElY,
        elWidth: currentElW,
        elHeight: currentElH,
        realX: currentElX * realRateEl_w,
        realY: currentElY * realRateEl_h,
        realWidth: currentElW * realRateEl_w,
        realHeight: currentElH * realRateEl_h
      })
  }

  function onEnd() {
    isOperateStart = false
    _options.value.onFinish && _options.value.onFinish()
  }

  function onTouchStart(e: TouchEvent) {
    e.preventDefault()
    if (e.touches.length > 1) {
      return
    }
    const { clientX, clientY } = e.touches[0]

    onStart({
      x: clientX,
      y: clientY
    })
  }

  function onTouchMove(e: TouchEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.touches.length > 1) {
      return
    }
    const { clientX, clientY } = e.touches[0]

    onMove({
      x: clientX,
      y: clientY
    })
  }

  function onTouchEnd() {
    onEnd()
  }

  function onMouseDown(e: MouseEvent) {
    e.preventDefault()
    // 非左键按下
    if (e.buttons !== 1) {
      return
    }
    const { clientX, clientY } = e

    onStart({
      x: clientX,
      y: clientY
    })
  }

  function onMouseMove(e: MouseEvent) {
    e.preventDefault()
    // 非左键按下
    if (e.buttons !== 1) {
      onEnd()
      return
    }
    const { clientX, clientY } = e

    onMove({
      x: clientX,
      y: clientY
    })
  }

  function onMouseUp() {
    onEnd()
  }

  function bindEvent() {
    removeEvent()
    if (isMobile) {
      _operateEl.value.addEventListener('touchstart', onTouchStart, { capture: true })
      document.body.addEventListener('touchcancel', onTouchEnd, { capture: true })
      document.body.addEventListener('touchmove', onTouchMove, { capture: true })
      document.body.addEventListener('touchend', onTouchEnd, { capture: true })
    } else {
      _operateEl.value.addEventListener('mousedown', onMouseDown)
      document.body.addEventListener('mousemove', onMouseMove, { capture: true })
      document.body.addEventListener('mouseup', onMouseUp, { capture: true })
    }
  }

  function removeEvent() {
    if (isMobile) {
      _operateEl.value.removeEventListener('touchstart', onTouchStart)
      document.body.removeEventListener('touchmove', onTouchMove)
      document.body.removeEventListener('touchend', onTouchEnd)
      document.body.removeEventListener('touchcancel', onTouchEnd)
    } else {
      _operateEl.value.removeEventListener('mousedown', onMouseDown)
      document.body.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseup', onMouseUp)
    }
  }

  onBeforeUnmount(() => {
    isOperateStart = false
    removeEvent()
  })
}
