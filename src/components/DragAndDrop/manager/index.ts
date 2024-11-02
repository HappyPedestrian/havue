import EventBus from '@/utils/EventBus'

export type Point = {
  x: number
  y: number
}

export type DragType = string | number | symbol

type Events = {
  start: (p: Point) => void
  move: (params: { type: DragType; data: any; point: Point }) => void
  end: (params: { type: DragType; data: any; point: Point }) => void
}

export class DnDManager extends EventBus<Events> {
  public isDragStart: boolean = false
  public dragType: DragType | undefined = undefined
  public dragData: any

  private touchStartPosition: Point = { x: 0, y: 0 }
  private lastMovePoint: Point = { x: 0, y: 0 }
  private emitTouchStartTimer: number | undefined = undefined

  constructor() {
    super()
    this.bindEventListener()
  }

  public updateDargInfo(type: Exclude<DragType, undefined>, data: any) {
    if (type === undefined || type === null) {
      throw new Error('请传入拖动元素 type')
    }
    this.isDragStart = true
    this.dragType = type
    this.dragData = data
  }

  /**
   * 通知 Draggable 拖拽开始
   * @param point
   */
  private onStart(point: Point) {
    this.emit('start', point)
  }

  /**
   * 通知 Draggable 移动
   * @param point
   * @returns
   */
  private onMove(point: Point) {
    if (!this.isDragStart || !this.dragType) {
      return
    }
    this.lastMovePoint = point
    this.emit('move', {
      type: this.dragType,
      data: this.dragData,
      point: point
    })
  }

  /**
   * 结束拖拽
   * @returns
   */
  private onEnd() {
    if (!this.isDragStart || !this.dragType) {
      return
    }
    this.isDragStart = false
    this.emit('end', {
      point: this.lastMovePoint,
      type: this.dragType,
      data: this.dragData
    })
  }

  private onMouseDown(e: MouseEvent) {
    e.preventDefault()
    // 非左键按下
    if (e.buttons !== 1) {
      this.onEnd()
      return
    }
    const { x, y } = e

    this.onStart({
      x,
      y
    })
  }

  private onMouseMove(e: MouseEvent) {
    e.preventDefault()
    // 非左键按下
    if (e.buttons !== 1) {
      this.onEnd()
      return
    }
    const { x, y } = e

    this.onMove({
      x,
      y
    })
  }

  private onMouseUp() {
    this.onEnd()
  }

  private onTouchStart(e: TouchEvent) {
    if (e.touches.length > 1) {
      return
    }
    const { pageX, pageY } = e.touches[0]
    const position = {
      x: pageX,
      y: pageY
    }
    this.touchStartPosition = position
    // 300ms后调用onStart（如果在此期间没有移动超过30px）
    this.emitTouchStartTimer = window.setTimeout(() => {
      this.onStart(position)
    }, 300)
  }

  private onTouchMove(e: TouchEvent) {
    if (e.touches.length > 1) {
      return
    }
    const { pageX, pageY } = e.touches[0]
    if (this.isDragStart) {
      e.preventDefault()
      e.stopPropagation()
      this.onMove({
        x: pageX,
        y: pageY
      })
    } else {
      // touch 300ms内移动了超过30px，认为不是拖拽
      const { x, y } = this.touchStartPosition
      if (Math.abs(x - pageX) > 30 || Math.abs(y - pageY) > 30) {
        clearTimeout(this.emitTouchStartTimer)
      }
    }
  }
  private onTouchEnd() {
    clearTimeout(this.emitTouchStartTimer)
    this.onEnd()
  }

  private bindEventListener() {
    if (document.body) {
      document.body.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false })
      document.body.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false })
      document.body.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false })
      document.body.addEventListener('touchcancel', this.onTouchEnd.bind(this))
      document.body.addEventListener('mousedown', this.onMouseDown.bind(this))
      document.body.addEventListener('mousemove', this.onMouseMove.bind(this))
      document.body.addEventListener('mouseup', this.onMouseUp.bind(this))
    } else {
      document.addEventListener('DOMContentLoaded', this.bindEventListener)
    }
  }

  private removeEventListener() {
    document.body.removeEventListener('touchstart', this.onTouchStart)
    document.body.removeEventListener('touchmove', this.onTouchMove)
    document.body.removeEventListener('touchend', this.onTouchEnd)
    document.body.removeEventListener('touchcancel', this.onTouchEnd)
    document.body.removeEventListener('mousemove', this.onMouseMove)
    document.body.removeEventListener('mouseup', this.onMouseUp)
  }

  public destroyed() {
    this.isDragStart = false
    this.dragType = undefined
    this.dragData = undefined
    this.removeEventListener()
  }
}

export const DnDManagerInstance = new DnDManager()
