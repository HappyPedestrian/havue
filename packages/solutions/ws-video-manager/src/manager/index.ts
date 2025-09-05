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
  /**
   * websocket流连接数量限制, 移动端默认10个，pc端默认32个
   * Limit the number of websocket streaming connections to 10 by default for mobile and 32 by default for pc
   */
  connectLimit?: number
  /** WebSocketLoader configuration */
  wsOptions?: WebSocketOptionsType
  /**
   * websocket重连时，重新解析视频编码方式，
   * 默认 true
   *
   * When the websocket reconnects, the video encoding is reparsed.
   * The default is true
   */
  reparseMimeOnReconnect?: boolean
  /** Render 实例配置 */
  renderOptions?: Partial<RenderConstructorOptionType>
  /**
   * 是否使用WebGL，默认 false，
   * WebGL在不同游览器，以及受限于显存，不能同时创建过多WebGL上下文，一般8-16个
   *
   * Whether to use WebGL, false by default,
   * WebGL can not be created too many WebGL contexts at the same time in different browsers,
   *  and due to the limitations of video memory, usually 8-16 WebGL contexts
   */
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
  /** 需要绘制的canvas map | canvas map to be drawn */
  canvasMap: Map<HTMLCanvasElement, CanvasDrawer>
  /** WebSocketLoader instance */
  socket: WebSocketLoader
  /** Render instance */
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
  /** socket相关信息map | map of socket information */
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
   * 添加socket连接 | Adding a socket connection
   * @param url socket url
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
   * 绑定render事件 | Binding the render event
   * @param url 连接地址 | websocket url
   * @param render Render instance
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
   * Destroying the socket connect
   * @param url socket url
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
   * 绑定socket事件 | Binding socket events
   * @param url websocket url
   * @param socket WebSocketLoader instance
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
   * url对应的 socket实例是否已存在 | Whether the socket instance for the url already exists
   * @param url websocket url
   * @returns boolean
   */
  private _isSocketExist(url: string): boolean {
    return this._wsInfoMap.has(url)
  }

  /**
   * 添加url对应socket，以及需要绘制的canvas元素
   * Add the socket for the url and the canvas element to draw
   * @param canvas canvas
   * @param url websocket url
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
   * 初始化canvas背景 | Initialize the canvas background
   * @param canvas canvas
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
   * 删除canvas元素 || Remove the canvas element
   * @param canvas canvas
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
   * 获取canvas是否已经添加过 | Gets whether the canvas has already been added
   * @param canvas canvas
   * @returns boolean
   */
  public isCanvasExist(canvas: HTMLCanvasElement): boolean {
    const values = this._wsInfoMap.values()
    return [...values].some((info) => {
      return info.canvasMap.has(canvas)
    })
  }

  /** 设置全部render静音状态 | Mute all render */
  public setAllVideoMutedState(muted: boolean) {
    this._wsInfoMap.forEach((wsInfo) => {
      wsInfo.render.muted = muted
    })
  }

  /** 更新单个render实例的配置 | Update the configuration of a single render instance */
  public updateRenderOptions(url: string, options?: Partial<RenderConstructorOptionType>) {
    if (options) {
      const wsInfo = this._wsInfoMap.get(url)
      wsInfo?.render.updateOptions(options)
    }
  }

  /**
   * 设置单个render静音状态 | Set a single render to be silent
   * @param url
   * @param {boolean} muted  是否静音 | Muted or not
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
   * Gets whether the render video element of the url is muted
   * @param url websocket url
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
   * Unmute a single video and mute all other videos
   * @param url websocket url
   */
  public playOneAudio(url: string) {
    this.setAllVideoMutedState(true)
    this.setOneMutedState(url, false)
  }

  /**
   * 设置单个render是否继续处理ws数据
   * Sets whether a single render continues to process ws data
   * @param url
   */
  public setOneVideoPausedState(url: string, paused: boolean) {
    const wsInfo = this._wsInfoMap.get(url)
    if (!wsInfo) {
      return
    }
    wsInfo.render.paused = paused
  }

  /** 设置全部render是否继续处理ws数据 | Sets whether all render continues to process ws data */
  public setAllVideoPausedState(paused: boolean) {
    this._wsInfoMap.forEach((wsInfo) => {
      wsInfo.render.paused = paused
    })
  }

  /**
   * 获取url对应render video元素的播放状态
   * Get the playback status of the render video element corresponding to the url
   * @param url websocket url
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
   * A single video continues to play while others pause to process data
   * @param url websocket url
   */
  public playOneVideo(url: string) {
    this.setAllVideoPausedState(true)
    this.setOneVideoPausedState(url, false)
  }

  /**
   * 刷新socket，以及播放时间
   * Refresh the socket, and the playback time
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
   * 销毁 | Destroy
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
