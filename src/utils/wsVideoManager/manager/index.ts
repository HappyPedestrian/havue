import type { WebSocketOptionsType } from '../loader/websocket-loader'
import type { RenderConstructorOptionType } from '../render'
import { WebSocketLoader } from '../loader'
import { Render, DEFAULT_OPTIONS as RENDER_DEFAULT_OPTIONS } from '../render'

export type WsVideoManaCstorOptionType = {
  /** WebSocketLoader 实例配置 */
  wsOptions?: WebSocketOptionsType
  /** Render 实例配置 */
  renderOptions?: Partial<RenderConstructorOptionType>
}

const DEFAULT_OPTIONS: WsVideoManaCstorOptionType = {
  wsOptions: {
    binaryType: 'arraybuffer' as WebSocket['binaryType']
  },
  renderOptions: RENDER_DEFAULT_OPTIONS
}

type WsInfoType = {
  /** 需要绘制的canvas列表 */
  canvasSet: Set<HTMLCanvasElement>
  /** WebSocketLoader 实例 */
  socket: WebSocketLoader
  /** socket连接渲染render实例 */
  render: Render
}

export class WsVideoManager {
  /** socket连接 渲染相关对应信息 */
  private _wsInfoMap: Map<string, WsInfoType> = new Map()

  private _option: WsVideoManaCstorOptionType = {}

  constructor(options?: WsVideoManaCstorOptionType) {
    this._option = options ? Object.assign({}, DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS
  }

  /**
   * 添加socket实例
   * @param url socket地址
   * @returns
   */
  private addSocket(url: string) {
    if (this.isSocketExist(url)) {
      return
    }
    const socket = new WebSocketLoader(url, this._option.wsOptions)

    const render = new Render(this._option.renderOptions)
    const wsInfo: WsInfoType = {
      socket,
      canvasSet: new Set(),
      render: render
    }

    render.setRenderFn((pixiCanvas: HTMLCanvasElement | HTMLVideoElement) => {
      const canvasSet = wsInfo.canvasSet

      if (!canvasSet || !canvasSet.size) {
        return
      }
      ;[...canvasSet].forEach((canvas) => {
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return
        }
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(pixiCanvas, 0, 0, canvas.width, canvas.height)
      })
    })

    this._wsInfoMap.set(url, wsInfo)

    this.bindSocketEvent(socket, render)

    socket.open()
  }

  /**
   * 销毁socket实例
   * @param url socket地址
   */
  private removeSocket(url: string) {
    const wsInfo = this._wsInfoMap.get(url)
    if (wsInfo) {
      const { socket, render } = wsInfo
      socket.close()
      socket.destroy()
      render.destroy()
      this._wsInfoMap.delete(url)
    }
  }

  /**
   * 绑定socket事件
   * @param url 连接地址
   * @param socket WebSocketLoader实例
   */
  private bindSocketEvent(socket: WebSocketLoader, render: Render) {
    socket.on('message', (event: WebSocketEventMap['message']) => {
      render.appendMediaBuffer(event.data)
    })
  }

  /**
   * url对应的 socket实例是否已存在
   * @param url socket地址
   * @returns boolean
   */
  private isSocketExist(url: string): boolean {
    return this._wsInfoMap.has(url)
  }

  /**
   * 添加url对应socket，以及需要绘制的canvas元素
   * @param canvas canvas元素
   * @param url socket url地址
   */
  public addCanvas(canvas: HTMLCanvasElement, url: string) {
    this.addSocket(url)
    if (this.isCanvasExist(canvas)) {
      throw new Error('the canvas allready exsist! please remove it before add')
    }
    const wsInfo = this._wsInfoMap.get(url)
    if (!wsInfo) {
      return
    }
    const { canvasSet } = wsInfo
    if (!canvasSet) {
      wsInfo.canvasSet = new Set([canvas])
    } else {
      canvasSet.add(canvas)
    }

    this.setupCanvas(canvas)
  }

  /**
   * 初始化canvas背景
   * @param canvas canvas元素
   * @returns
   */
  setupCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  /**
   * 删除canvas元素
   * @param canvas canvas元素
   */
  public removeCanvas(canvas: HTMLCanvasElement) {
    const entries = this._wsInfoMap.entries()
    const entriesList = [...entries]
    entriesList.some(([url, wsInfo]) => {
      const { canvasSet } = wsInfo
      if (canvasSet.has(canvas)) {
        canvasSet.delete(canvas)
        if (canvasSet.size === 0) {
          this.removeSocket(url)
        }
        return true
      }
    })
  }

  /**
   * 返回canvas是否已经添加过
   * @param canvas canvas元素
   * @returns boolean
   */
  public isCanvasExist(canvas: HTMLCanvasElement): boolean {
    const entries = this._wsInfoMap.entries()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return [...entries].some(([_, info]) => {
      return info.canvasSet.has(canvas)
    })
  }

  /** 设置全部render静音状态 */
  public setAllVideoMutedState(muted: boolean) {
    this._wsInfoMap.forEach((wsInfo) => {
      wsInfo.render.muted = muted
    })
  }

  /**
   * 设置单个render静音状态
   * @param url
   * @param muted boolean 是否静音
   */
  public setOneMutedState(url: string, muted: boolean) {
    const wsInfo = this._wsInfoMap.get(url)
    if (!wsInfo) {
      return
    }
    wsInfo.render.muted = muted
  }

  /**
   * 获取url对应render video元素是否静音
   * @param url socket地址
   */
  public getOneMutedState(url: string) {
    const wsInfo = this._wsInfoMap.get(url)
    if (!wsInfo) {
      return true
    }
    return wsInfo.render.muted
  }

  /**
   * 单个解除静音，其他未静音的变成静音，只播放一个
   * @param url socket地址
   */
  public playOneAudio(url: string) {
    this.setAllVideoMutedState(true)
    this.setOneMutedState(url, false)
  }

  /**
   * 设置单个render是否继续处理ws数据
   * @param url
   */
  public setOneVideoPausedState(url: string, paused: boolean) {
    const wsInfo = this._wsInfoMap.get(url)
    if (!wsInfo) {
      return
    }
    wsInfo.render.paused = paused
  }

  /** 设置全部render是否继续处理ws数据 */
  public setAllVideoPausedState(paused: boolean) {
    this._wsInfoMap.forEach((wsInfo) => {
      wsInfo.render.paused = paused
    })
  }

  /**
   * 获取url对应render video元素是否继续播放
   * @param url socket地址
   */
  public getOneVideoPausedState(url: string) {
    const wsInfo = this._wsInfoMap.get(url)
    if (!wsInfo) {
      return false
    }
    return wsInfo.render.paused
  }

  /**
   * 单个视频继续播放，其他暂停处理数据
   * @param url socket地址
   */
  public playOneVideo(url: string) {
    this.setAllVideoPausedState(true)
    this.setOneVideoPausedState(url, false)
  }

  /**
   * 刷新socket，以及播放时间
   */
  public refresh(url?: string) {
    if (url) {
      const wsInfo: WsInfoType | undefined = this._wsInfoMap.get(url)
      if (wsInfo) {
        wsInfo.render.refresh()
        if (!wsInfo.socket.isConnecting) {
          wsInfo.socket.reconnect()
        }
      }
    } else {
      this._wsInfoMap.forEach((wsInfo) => {
        wsInfo.render.refresh()
        if (!wsInfo.socket.isConnecting) {
          wsInfo.socket.reconnect()
        }
      })
    }
  }

  /**
   * 销毁
   */
  public destroy() {
    this._wsInfoMap.forEach((wsInfo) => {
      const { socket, render } = wsInfo
      socket.close()
      socket.destroy()
      render.destroy()
    })
    this._wsInfoMap.clear()
  }
}
