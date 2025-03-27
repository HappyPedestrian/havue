// #region typeimport
import type { WebSocketOptionsType } from '../loader/websocket-loader'
import type { RenderConstructorOptionType, VideoInfo } from '../render'
// #endregion typeimport
import { EventBus, isMobile } from '@havue/shared'
import { WebSocketLoader } from '../loader'
import {
  Render,
  WS_VIDEO_RENDER_DEFAULT_OPTIONS as RENDER_DEFAULT_OPTIONS,
  RenderEventsEnum,
  AudioState,
  VideoState
} from '../render'
import { CanvasDrawer } from '../render/drawer'

// #region typedefine
export type WsVideoManaCstorOptionType = {
  /** 预监流连接数量限制, 移动端默认10个，pc端默认32个 */
  connectLimit?: number
  /** WebSocketLoader 实例配置 */
  wsOptions?: WebSocketOptionsType
  /**
   * websocket重连时，重新解析视频编码方式，
   * 默认 true
   */
  reparseMimeOnReconnect?: boolean
  /** Render 实例配置 */
  renderOptions?: Partial<RenderConstructorOptionType>
  /**
   * 是否使用WebGL，
   * 默认 false，
   * WebGL在不同游览器，以及受限于显存，不能同时创建过多WebGL上下文，一般8-16个 */
  useWebgl?: boolean
}

const DEFAULT_OPTIONS: Required<WsVideoManaCstorOptionType> = Object.freeze({
  connectLimit: isMobile ? 10 : 32,
  wsOptions: {
    binaryType: 'arraybuffer' as WebSocket['binaryType']
  },
  reparseMimeOnReconnect: true,
  renderOptions: RENDER_DEFAULT_OPTIONS,
  useWebgl: false
})

type WsInfoType = {
  /** 需要绘制的canvas列表 */
  canvasMap: Map<HTMLCanvasElement, CanvasDrawer>
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

// #endregion typedefine

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
        const { render, canvasMap } = item

        if (!render) {
          return
        }
        const { videoEl, paused } = render
        if (videoEl && !paused && canvasMap.size) {
          const values = canvasMap.values()
          ;[...values].forEach((drawer) => {
            drawer.draw(videoEl)
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
  private _addSocket(url: string, renderOptions?: Partial<RenderConstructorOptionType>) {
    if (this._isSocketExist(url)) {
      this.updateRenderOptions(url, renderOptions)
      return
    }
    if (this._wsInfoMap.size >= this._option.connectLimit) {
      this.emit(EventEnums.CONNECT_LIMIT)
      return
    }
    const socket = new WebSocketLoader(url, this._option.wsOptions)

    const render = new Render(Object.assign({}, this._option.renderOptions, renderOptions))
    const wsInfo: WsInfoType = {
      socket,
      canvasMap: new Map(),
      render: render
    }

    this._wsInfoMap.set(url, wsInfo)
    this._emitWsUrlListChange()

    this._bindRenderEvent(url, render)
    this._bindSocketEvent(socket, render, url)

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
  private _bindSocketEvent(socket: WebSocketLoader, render: Render, url: string) {
    socket.on('close', () => {
      if (this._option.reparseMimeOnReconnect) {
        render.resetMimeType()
      }
      this.emit(EventEnums.SOCKET_CLOSE, url)
    })

    socket.on('reconnect', () => {
      if (this._option.reparseMimeOnReconnect) {
        render.resetMimeType()
      }
    })

    socket.on('message', (event: WebSocketEventMap['message']) => {
      render.appendMediaBuffer([event.data])
    })
  }

  private _emitWsUrlListChange() {
    this.emit(EventEnums.WS_URL_CHANGE, [...this._wsInfoMap.keys()])
    if (this._wsInfoMap.size) {
      if (!this._reqAnimationID) {
        this._setAnimate()
      }
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
  public addCanvas(canvas: HTMLCanvasElement, url: string, renderOptions?: Partial<RenderConstructorOptionType>) {
    this._addSocket(url, renderOptions)
    if (this.isCanvasExist(canvas)) {
      throw new Error('the canvas allready exsist! please remove it before add')
    }
    const wsInfo = this._wsInfoMap.get(url)
    if (!wsInfo) {
      return
    }
    const { canvasMap } = wsInfo
    if (!canvasMap) {
      wsInfo.canvasMap = new Map([[canvas, new CanvasDrawer(canvas, this._option.useWebgl)]])
    } else {
      canvasMap.set(canvas, new CanvasDrawer(canvas, this._option.useWebgl))
    }

    // this._setupCanvas(canvas)
  }

  /**
   * 初始化canvas背景
   * @param canvas canvas元素
   * @returns
   */
  // private _setupCanvas(canvas: HTMLCanvasElement) {
  //   const ctx = canvas.getContext('2d')
  //   if (!ctx) {
  //     return
  //   }
  //   ctx.fillStyle = 'black'
  //   ctx.fillRect(0, 0, canvas.width, canvas.height)
  // }

  /**
   * 删除canvas元素
   * @param canvas canvas元素
   */
  public removeCanvas(canvas: HTMLCanvasElement) {
    const entries = this._wsInfoMap.entries()
    const entriesList = [...entries]
    entriesList.some(([url, wsInfo]) => {
      const { canvasMap } = wsInfo
      if (canvasMap.has(canvas)) {
        canvasMap.get(canvas)?.destroy()
        canvasMap.delete(canvas)
        if (canvasMap.size === 0) {
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
    const values = this._wsInfoMap.values()
    return [...values].some((info) => {
      return info.canvasMap.has(canvas)
    })
  }

  /** 设置全部render静音状态 */
  public setAllVideoMutedState(muted: boolean) {
    this._wsInfoMap.forEach((wsInfo) => {
      wsInfo.render.muted = muted
    })
  }

  /** 更新单个render实例的配置 */
  public updateRenderOptions(url: string, options?: Partial<RenderConstructorOptionType>) {
    if (options) {
      const wsInfo = this._wsInfoMap.get(url)
      wsInfo?.render.updateOptions(options)
    }
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
      const { socket, render, canvasMap } = wsInfo
      socket.close()
      socket.destroy()
      render.destroy()

      canvasMap.forEach((drawer) => {
        drawer.destroy()
      })
      canvasMap.clear()
    })
    this._wsInfoMap.clear()
    this._emitWsUrlListChange()
    this._reqAnimationID && cancelAnimationFrame(this._reqAnimationID)
    this._reqAnimationID = null
  }
}
