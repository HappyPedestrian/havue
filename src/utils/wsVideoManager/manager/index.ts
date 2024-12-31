import EventBus from '@/utils/eventBus'
import type { WebSocketOptionsType } from '../loader/websocket-loader'
import type { RenderConstructorOptionType, VideoInfo } from '../render'
import { WebSocketLoader } from '../loader'
import { Render, DEFAULT_OPTIONS as RENDER_DEFAULT_OPTIONS, RenderEventsEnum, AudioState, VideoState } from '../render'

export type WsVideoManaCstorOptionType = {
  /** 预监流连接数量限制, 默认10个 */
  connectLimit?: number
  /** WebSocketLoader 实例配置 */
  wsOptions?: WebSocketOptionsType
  /** Render 实例配置 */
  renderOptions?: Partial<RenderConstructorOptionType>
}

const DEFAULT_OPTIONS: Required<WsVideoManaCstorOptionType> = Object.freeze({
  connectLimit: 10,
  wsOptions: {
    binaryType: 'arraybuffer' as WebSocket['binaryType']
  },
  renderOptions: RENDER_DEFAULT_OPTIONS
})

type WsInfoType = {
  /** 需要绘制的canvas列表 */
  canvasSet: Set<HTMLCanvasElement>
  /** WebSocketLoader 实例 */
  socket: WebSocketLoader
  /** socket连接渲染render实例 */
  render: Render
}

export enum EventEnums {
  WS_URL_CHANGE = 'wsUrlChange',
  SOCKET_CLOSE = 'socketClose',
  CONNECT_LIMIT = 'connectLimit'
}

type Events = {
  [EventEnums.WS_URL_CHANGE]: (urls: string[]) => void
  [RenderEventsEnum.AUDIO_STATE_CHANGE]: (url: string, state: AudioState) => void
  [RenderEventsEnum.VIDEO_INFO_UPDATE]: (url: string, info: VideoInfo) => void
  [RenderEventsEnum.VIDEO_STATE_CHANGE]: (url: string, state: VideoState) => void
  [EventEnums.SOCKET_CLOSE]: (url: string) => void
  [EventEnums.CONNECT_LIMIT]: () => void
}

export const WsVideoManagerEventEnums = Object.assign({}, EventEnums, RenderEventsEnum)

export class WsVideoManager extends EventBus<Events> {
  /** socket连接 渲染相关对应信息 */
  private _wsInfoMap: Map<string, WsInfoType> = new Map()

  private _option: Required<WsVideoManaCstorOptionType> = DEFAULT_OPTIONS

  private _reqAnimationID: number | null = null

  constructor(options?: WsVideoManaCstorOptionType) {
    super()
    this._option = options ? Object.assign({}, DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS
  }

  get linkedUrlList() {
    return [...this._wsInfoMap.keys()]
  }

  get connectLimit() {
    return this._option.connectLimit
  }

  private _setAnimate() {
    this._reqAnimationID && cancelAnimationFrame(this._reqAnimationID)
    const render = () => {
      this._wsInfoMap.forEach((item) => {
        const { render, canvasSet } = item

        if (!render) {
          return
        }
        const { videoEl, paused } = render
        if (videoEl && !paused && canvasSet.size) {
          ;[...canvasSet].forEach((canvas) => {
            const ctx = canvas.getContext('2d')
            if (!ctx) {
              return
            }
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
          })
        }
      })

      this._reqAnimationID = requestAnimationFrame(render)
    }
    render()
  }

  /**
   * 添加socket实例
   * @param url socket地址
   * @returns
   */
  private _addSocket(url: string) {
    if (this._isSocketExist(url)) {
      return
    }
    if (this._wsInfoMap.size >= this._option.connectLimit) {
      this.emit(EventEnums.CONNECT_LIMIT)
      return
    }
    const socket = new WebSocketLoader(url, this._option.wsOptions)

    socket.on('close', () => {
      this.emit(EventEnums.SOCKET_CLOSE, url)
    })

    const render = new Render(this._option.renderOptions)
    const wsInfo: WsInfoType = {
      socket,
      canvasSet: new Set(),
      render: render
    }

    this._wsInfoMap.set(url, wsInfo)
    this._emitWsUrlListChange()

    this._bindRenderEvent(url, render)
    this._bindSocketEvent(socket, render)

    socket.open()
  }

  /**
   * 绑定render事件
   * @param url 连接地址
   * @param render Render实例
   */
  private _bindRenderEvent(url: string, render: Render) {
    render.on(RenderEventsEnum.AUDIO_STATE_CHANGE, (state) => {
      this.emit(RenderEventsEnum.AUDIO_STATE_CHANGE, url, state)
    })
    render.on(RenderEventsEnum.VIDEO_STATE_CHANGE, (state) => {
      this.emit(RenderEventsEnum.VIDEO_STATE_CHANGE, url, state)
    })
    render.on(RenderEventsEnum.VIDEO_INFO_UPDATE, (info) => {
      this.emit(RenderEventsEnum.VIDEO_INFO_UPDATE, url, info)
    })
  }

  /**
   * 销毁socket实例
   * @param url socket地址
   */
  private _removeSocket(url: string) {
    const wsInfo = this._wsInfoMap.get(url)
    if (wsInfo) {
      const { socket, render } = wsInfo
      socket.close()
      socket.destroy()
      render.destroy()
      this._wsInfoMap.delete(url)
      this._emitWsUrlListChange()
    }
  }

  /**
   * 绑定socket事件
   * @param url 连接地址
   * @param socket WebSocketLoader实例
   */
  private _bindSocketEvent(socket: WebSocketLoader, render: Render) {
    socket.on('message', (event: WebSocketEventMap['message']) => {
      render.appendMediaBuffer([event.data])
    })
  }

  private _emitWsUrlListChange() {
    this.emit(EventEnums.WS_URL_CHANGE, [...this._wsInfoMap.keys()])
    if (this._wsInfoMap.size) {
      !this._reqAnimationID && this._setAnimate()
    } else {
      this._reqAnimationID && cancelAnimationFrame(this._reqAnimationID)
      this._reqAnimationID = null
    }
  }

  /**
   * url对应的 socket实例是否已存在
   * @param url socket地址
   * @returns boolean
   */
  private _isSocketExist(url: string): boolean {
    return this._wsInfoMap.has(url)
  }

  /**
   * 添加url对应socket，以及需要绘制的canvas元素
   * @param canvas canvas元素
   * @param url socket url地址
   */
  public addCanvas(canvas: HTMLCanvasElement, url: string) {
    this._addSocket(url)
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

    this._setupCanvas(canvas)
  }

  /**
   * 初始化canvas背景
   * @param canvas canvas元素
   * @returns
   */
  private _setupCanvas(canvas: HTMLCanvasElement) {
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
          this._removeSocket(url)
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
    this._emitWsUrlListChange()
    this._reqAnimationID && cancelAnimationFrame(this._reqAnimationID)
    this._reqAnimationID = null
  }
}
