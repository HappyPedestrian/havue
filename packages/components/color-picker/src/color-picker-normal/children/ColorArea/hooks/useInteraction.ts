import type { Ref } from 'vue'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import throttle from 'lodash/throttle'

type Point = {
  x: number
  y: number
}

let lastPoint: Partial<Point> = {
  x: undefined,
  y: undefined
}

export function useInteraction(disabled: Ref<boolean>) {
  const colorAreaRef = ref<HTMLDivElement>()
  /** 当前颜色坐标 | Current color coordinates */
  const circlePickerCoordinate = reactive({
    x: 100,
    y: 100
  })

  function handleTouchStart(e: TouchEvent) {
    if (disabled.value) {
      return
    }
    if (e.touches.length === 0) {
      return
    }
    e.preventDefault()

    const { clientX, clientY } = e.touches[0]
    handleCirclePickerCoordinateChange({
      x: clientX,
      y: clientY
    })

    document.body.addEventListener('touchmove', handleTouchMove)
    document.body.addEventListener('touchend', handleTouchEnd)
  }

  function handleTouchMove(e: TouchEvent) {
    if (disabled.value) {
      return
    }
    if (e.touches.length > 1) {
      return
    }
    const { clientX, clientY } = e.touches[0]
    handleCirclePickerCoordinateChange({
      x: clientX,
      y: clientY
    })
  }

  function handleTouchEnd() {
    document.body.removeEventListener('touchmove', handleTouchMove)
    document.body.removeEventListener('touchend', handleTouchEnd)
  }

  function handleMounseDown(e: HTMLElementEventMap['mousedown']) {
    if (disabled.value) {
      return
    }
    document.body.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseup', handleMouseUp)
    handleCirclePickerCoordinateChange({
      x: e.clientX,
      y: e.clientY
    })
  }

  function handleMouseMove(e: HTMLElementEventMap['mousemove']) {
    if (disabled.value) {
      return
    }
    if (!(e.buttons && 1)) {
      handleMouseUp()
      return
    }
    handleCirclePickerCoordinateChange({
      x: e.clientX,
      y: e.clientY
    })
  }

  /** 处理鼠标拖动 | Handles mouse drag */
  const handleCirclePickerCoordinateChange = throttle(handleCirclePickerCoordinateChangeFn, 20)
  // const handleCirclePickerCoordinateChange = handleCirclePickerCoordinateChangeFn
  function handleCirclePickerCoordinateChangeFn(point: Point) {
    const { x: clientX, y: clientY } = point
    if (lastPoint.x == point.x && lastPoint.y == point.y) {
      return
    }
    lastPoint = point
    const colorAreaRect = colorAreaRef.value?.getBoundingClientRect()
    if (!colorAreaRect) {
      return
    }
    const { left, top, width, height } = colorAreaRect

    let x = 0
    let y = 0
    if (clientX <= left) {
      x = 0
    } else if (clientX >= left + width) {
      x = width
    } else {
      x = clientX - left
    }

    if (clientY <= top) {
      y = 0
    } else if (clientY >= top + height) {
      y = height
    } else {
      y = clientY - top
    }
    circlePickerCoordinate.x = (x / width) * 100
    circlePickerCoordinate.y = ((height - y) / height) * 100
  }

  function handleMouseUp() {
    document.body.removeEventListener('mousemove', handleMouseMove)
    document.body.removeEventListener('mouseup', handleMouseUp)
  }

  /**
   * 更新圆形颜色位置 | Update the current color position
   * @param x 横坐标 | Horizontal coordinate
   * @param y 纵坐标 | Vertical coordinate
   * @param width 坐标系宽度 | Width of the coordinate system
   * @param height 坐标系高度 | Height of the coordinate system
   */
  function setCirclePickerCoordinate(x: number, y: number) {
    circlePickerCoordinate.x = x
    circlePickerCoordinate.y = y
  }

  onMounted(() => {
    colorAreaRef.value?.addEventListener('touchstart', handleTouchStart)

    colorAreaRef.value?.addEventListener('mousedown', handleMounseDown)
  })

  onBeforeUnmount(() => {
    colorAreaRef.value?.removeEventListener('touchstart', handleTouchStart)
    document.body.removeEventListener('touchmove', handleTouchMove)
    document.body.removeEventListener('touchend', handleTouchEnd)

    colorAreaRef.value?.removeEventListener('mousedown', handleMounseDown)
    document.body.removeEventListener('mousemove', handleMouseMove)
    document.body.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    colorAreaRef,
    circlePickerCoordinate,
    setCirclePickerCoordinate
  }
}
