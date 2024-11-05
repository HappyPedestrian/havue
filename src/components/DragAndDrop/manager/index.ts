import EventBus from '@/utils/EventBus'
import { isMobile } from '@/utils/platform'

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
  /** 是否开始拖动 */
  public isDragStart: boolean = false
  /** 拖动元素类型 */
  public dragType: DragType | undefined = undefined
  /** Draggable传递的数据，
   * 供Droppable使用
   */
  public dragData: any

  /** 移动端长按一定时间才触发 onStart */
  private touchStartPressTime = 300
  /** touchstart事件触发的时的时间 */
  private touchStartTime: number = 0
  /** touchstart时间触发的位置 */
  private touchStartPosition: Point = { x: 0, y: 0 }
  /** onMove最后位置 */
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
    const { clientX, clientY } = e

    this.onStart({
      x: clientX,
      y: clientY
    })
  }

  private onMouseMove(e: MouseEvent) {
    e.preventDefault()
    // 非左键按下
    if (e.buttons !== 1) {
      this.onEnd()
      return
    }
    const { clientX, clientY } = e

    this.onMove({
      x: clientX,
      y: clientY
    })
  }

  private onMouseUp() {
    this.onEnd()
  }

  private onTouchStart(e: TouchEvent) {
    if (e.touches.length > 1) {
      return
    }
    const { clientX, clientY } = e.touches[0]
    const position = {
      x: clientX,
      y: clientY
    }
    this.touchStartTime = Date.now()
    this.touchStartPosition = position
    // 300ms后调用onStart（如果在此期间没有移动超过30px）
    this.emitTouchStartTimer = window.setTimeout(() => {
      this.onStart(position)
    }, this.touchStartPressTime)
  }

  private onTouchMove(e: TouchEvent) {
    if (e.touches.length > 1) {
      return
    }
    const { clientX, clientY } = e.touches[0]
    if (this.isDragStart) {
      e.preventDefault()
      e.stopPropagation()
      this.onMove({
        x: clientX,
        y: clientY
      })
    } else {
      // touch 300ms内移动了超过30px，认为不是拖拽
      const { x, y } = this.touchStartPosition
      const timeInLimit = Date.now() - this.touchStartTime < this.touchStartPressTime
      if (timeInLimit && (Math.abs(x - clientX) > 30 || Math.abs(y - clientY) > 30)) {
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
      if (isMobile) {
        document.body.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false })
        document.body.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false })
        document.body.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false })
        // document.body.addEventListener(
        //   'touchcancel',
        //   () => {
        //     alert('touchcancel')
        //   },
        //   { passive: false }
        // )
      } else {
        document.body.addEventListener('mousedown', this.onMouseDown.bind(this))
        document.body.addEventListener('mousemove', this.onMouseMove.bind(this))
        document.body.addEventListener('mouseup', this.onMouseUp.bind(this))
      }
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
