import { MaybeRef } from 'vue'
import { ref, computed, isRef, onMounted, onBeforeUnmount, reactive } from 'vue'
import { throttle } from '../utils/tools'

type Point = {
  x: number
  y: number
}

export function useOperateEvent(options: { disabled: MaybeRef<boolean> }) {
  const colorAreaRef = ref<HTMLDivElement>()
  /** 当前颜色坐标 | Current color coordinates */
  const circlePickerCoordinate = reactive({
    x: 0,
    y: 0
  })

  const isDisabled = computed(() => {
    return isRef(options.disabled) ? options.disabled.value : options.disabled
  })

  function handleTouchStart(e: TouchEvent) {
    if (isDisabled.value) {
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
    if (isDisabled.value) {
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
  function handleCirclePickerCoordinateChangeFn(point: Point) {
    if (isDisabled.value) {
      return
    }
    const { x: clientX, y: clientY } = point
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
    circlePickerCoordinate.x = x
    circlePickerCoordinate.y = y
  }

  function handleMouseUp() {
    document.body.removeEventListener('mousemove', handleMouseMove)
    document.body.removeEventListener('mouseup', handleMouseUp)
  }

  /**
   * 更新当前颜色坐标位置 | Update the current color coordinate position
   * @param x 横坐标 | Horizontal coordinate
   * @param y 纵坐标 | Vertical coordinate
   * @param width 坐标系宽度 | Width of the coordinate system
   * @param height 坐标系高度 | Height of the coordinate system
   */
  function setCirclePickerCoordinate(x: number, y: number, width: number, height: number) {
    const colorAreaRect = colorAreaRef.value?.getBoundingClientRect()
    if (!colorAreaRect) {
      return
    }
    const { width: AreaWidth, height: AreaHeight } = colorAreaRect
    const scaleX = AreaWidth / width
    const scaleY = AreaHeight / height
    circlePickerCoordinate.x = x * scaleX
    circlePickerCoordinate.y = y * scaleY
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
