// import { Application, Sprite, UPDATE_PRIORITY } from 'pixi.js'
import MP4Box from 'mp4box'

export type RenderConstructorOptionType = {
  /** 当前播放currentTime和最新视频时长最多相差 秒数 */
  liveMaxLatency: number
  /** 最多存储的时间，用于清除在currentTime之前x秒时间节点前的buffer数据 */
  maxCache: number
}

export const DEFAULT_OPTIONS = {
  liveMaxLatency: 0.3,
  maxCache: 10
}

// 调试代码
// let id = 0
// const curPosX = 0
// let curPosY = 0

export class Render {
  /** video元素 */
  private _videoEl: HTMLVideoElement = document.createElement('video')
  /** pixi.js 实例 */
  // private _pixiApp: Application | null = null
  /** mp4box 实例 */
  private _mp4box: MP4Box = MP4Box.createFile()
  /** 接收到的socket消息 视频数据buffer数组 */
  private _bufsQueue: ArrayBuffer[] = []
  /** MediaSource 实例 */
  private _mediaSource: MediaSource | undefined
  /** SourceBuffer 实例 */
  private _sourceBuffer: SourceBuffer | undefined
  /** 上次sourcebuffer buffer段结束时间列表 ：[100, 200]*/
  /** 用于MediaSource的mimeType */
  private _mimeType: string = ''
  /** 是否暂停播放 */
  private _paused: boolean = false
  private _options: RenderConstructorOptionType

  private _reqAnimationID: number | undefined = undefined
  /** pixi.js ticker函数 */
  public onRender: ((canvas: HTMLCanvasElement | HTMLVideoElement) => void) | null = null

  // 调试代码
  // private divID = ''

  constructor(options: Partial<RenderConstructorOptionType> = {}) {
    this._options = options ? Object.assign({}, DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS
    this._mp4box.onReady = this._onMp4boxReady.bind(this)
    this._setupVideo()
  }

  get muted(): boolean {
    return this._videoEl.muted
  }

  set muted(val: boolean) {
    this._videoEl.muted = val
  }

  set paused(paused: boolean) {
    this._paused = paused
    if (paused) {
      this._videoEl.pause()
    } else {
      this._videoEl.play()
    }
  }

  get paused(): boolean {
    return this._paused
  }

  /**
   * 设置pixi.js的ticker render函数
   * @param fn
   */
  public setRenderFn(fn: (canvas: HTMLCanvasElement | HTMLVideoElement) => void) {
    this.onRender = fn
  }

  /**
   * 添加视频流buffer数据
   * @param buf
   */
  public appendMediaBuffer(buf: ArrayBuffer & { fileStart: number }) {
    if (this._paused) {
      return
    }
    if (!this._sourceBuffer) {
      buf.fileStart = 0
      this._mp4box.appendBuffer(buf)
    }
    this._bufsQueue.push(buf)
    requestAnimationFrame(() => this._catch())
  }

  /**
   * mp4box解析完成
   * @param info mp4box解析信息
   */
  private _onMp4boxReady(info: any) {
    console.log('onMp4boxReady', info)
    this._mp4box.flush()
    if (!info.isFragmented) {
      console.error('not fragmented mp4')
      return
    }
    this._mimeType = info.mime
    // this._setupVideo()
    // this.setupPixi()
    this._setupRender()
  }

  /**
   * canvas绘制循环
   */
  private _setupRender() {
    const render = () => {
      !this._paused && this.onRender && this.onRender(this._videoEl)
      this._reqAnimationID = requestAnimationFrame(render)
    }
    render()
    this._setupMSE()
  }

  // /**
  //  * 初始化pixi实例
  //  * @param width
  //  * @param height
  //  */
  // private setupPixi() {
  // 	this._pixiApp = new Application()
  // 	const videoSprite = Sprite.from(this._videoEl)
  // 	this._pixiApp.stage.addChild(videoSprite)
  // 	this._pixiApp
  // 		.init({
  // 			resizeTo: this._videoEl,
  // 			// height: this._videoEl.height,
  // 			// width: this._videoEl.width,
  // 			backgroundColor: 0x000000,
  // 			clearBeforeRender: true,
  // 		})
  // 		.then(() => {
  // 			if (!this._pixiApp) {
  // 				return
  // 			}
  // 			document.body.appendChild(this._pixiApp.canvas)
  // 			this._pixiApp.ticker.add(
  // 				() => {
  // 					if (!this._pixiApp) {
  // 						return
  // 					}
  // 					this.onRender(this._pixiApp.canvas)
  // 				},
  // 				null,
  // 				UPDATE_PRIORITY.UTILITY
  // 			)
  // 			this._setupMSE()
  // 		})
  // }

  /**
   * 初始化视频元素
   */
  private _setupVideo() {
    this._videoEl.preload = 'auto'
    this._videoEl.controls = false
    this._videoEl.muted = true
    this._videoEl.autoplay = true
    this._videoEl.loop = false
    this._videoEl.crossOrigin = 'anonymous'
    this._videoEl.playsInline = true
    this._videoEl['webkit-playsinline'] = true

    this._videoEl.addEventListener('canplay', () => {
      if (!this._paused) {
        this._videoEl.play()
      }
    })

    this._videoEl.addEventListener('error', (error) => {
      console.error('video error', error)
      setTimeout(() => {
        this._setupMSE()
      }, 500)
    })

    /**
     * bug: 因预监画面播放一段时间后，
     * 虽然视频时间在走，但video的画面会暂停,
     * 发现将视频元素添加到视口中，画面就不会暂停，
     * 可能与浏览器的资源优化策略有关，先将video标签添加到视口中,
     * 后面有时间寻找一下是否有其他解决方案
     */
    // this._videoEl.controls = true
    document.body.appendChild(this._videoEl)
    this._videoEl.style.position = 'fixed'
    this._videoEl.style.left = `0px`
    this._videoEl.style.top = `0px`
    this._videoEl.style.zIndex = '-10000'
    this._videoEl.style.width = '1px'
    this._videoEl.style.height = '1px'
    this._videoEl.style.opacity = '0.01'
    this._videoEl.style.pointerEvents = 'none'
    this._videoEl.style.touchAction = 'none'

    // 调试代码
    // this._videoEl.style.left = `${curPosX}px`
    // this._videoEl.style.top = `${curPosY}px`
    // this._videoEl.style.zIndex = '99999'
    // this._videoEl.style.width = '200px'
    // this._videoEl.style.height = '100px'
    // this._videoEl.controls = true
    // this._videoEl.style.opacity = '1'
    // const div = document.createElement('div')
    // div.id = `divID${id}`
    // this.divID = `divID${id}`
    // id = id + 1

    // div.style.position = 'fixed'
    // div.style.left = `${curPosX}px`
    // div.style.top = `${curPosY}px`
    // curPosY += 100
    // div.style.zIndex = '99999'
    // document.body.appendChild(div)
  }

  /**
   * 是否支持Media Source Extention
   * @returns boolean
   */
  public isSupportMSE() {
    return 'MediaSource' in window
  }

  /**
   * 初始化MSE
   * @returns
   */
  private _setupMSE(): void {
    if (!this.isSupportMSE()) {
      console.error('your borwser do not support MediaSource')
      return
    }
    if (!MediaSource.isTypeSupported(this._mimeType)) {
      console.error('Unsupported MIME type or codec: ', this._mimeType)
      return
    }
    this.destroyMediaSource()
    this._mediaSource = new MediaSource()
    URL.revokeObjectURL(this._videoEl.src)
    this._videoEl.src = URL.createObjectURL(this._mediaSource)

    this._mediaSource.addEventListener('sourceopen', () => {
      const sourceBuffer = (this._sourceBuffer = this._mediaSource!.addSourceBuffer(this._mimeType))
      sourceBuffer.mode = 'sequence'
      sourceBuffer.onupdateend = () => {
        const currentTime = this._videoEl.currentTime
        if (
          !sourceBuffer ||
          this._mediaSource?.readyState !== 'open' ||
          ![...this._mediaSource.sourceBuffers].includes(sourceBuffer)
        ) {
          return
        }
        // 调试代码
        // const div = document.getElementById(this.divID)
        // let innerHTML = `len:${sourceBuffer.buffered.length}`
        if (sourceBuffer.buffered.length > 0) {
          let bufferedLen = sourceBuffer.buffered.length
          /** 是否需要删除sourceBuffer中的buffer段 */
          const needDelBuf = bufferedLen > 1
          /**
           * sourceBuffer中有多个buffered，时间不连续
           * 导致视频播放到其中一个buffer最后就暂停了
           * 如果出现多个buffered，删除之前有的buffer
           * 使用最新的视频buffer进行播放
           */
          if (needDelBuf && currentTime) {
            if (currentTime < sourceBuffer.buffered.start(bufferedLen - 1)) {
              this._videoEl.currentTime = sourceBuffer.buffered.start(bufferedLen - 1)
            }

            for (let i = 0; i < bufferedLen; i++) {
              const curStart = sourceBuffer.buffered.start(i)
              const curEnd = sourceBuffer.buffered.end(i)

              if (!this._sourceBuffer!.updating && currentTime > curEnd) {
                this._sourceBuffer?.remove(curStart, curEnd)
                continue
              }
            }
          }

          // 调试代码
          // innerHTML += ` - start:${sourceBuffer.buffered.start(sourceBuffer.buffered.length - 1)} - end:${sourceBuffer.buffered.end(sourceBuffer.buffered.length - 1)} <br/>`
          // innerHTML += ` - currentTime: ${currentTime}`
          // div && (div.innerHTML = innerHTML)

          bufferedLen = sourceBuffer.buffered.length
          const start = sourceBuffer.buffered.start(bufferedLen - 1)
          const end = sourceBuffer.buffered.end(bufferedLen - 1)

          // 设置开始时间
          if (!currentTime && start) {
            this._videoEl.currentTime = start
          }

          // 限制最低延迟时间
          if (this._options.liveMaxLatency) {
            const offsetMaxLatency = this._options.liveMaxLatency

            if (end - currentTime > offsetMaxLatency) {
              this._videoEl.currentTime = end - 0.1
            }
          }
          // 移除当前时间之前的buffer
          if (!this._sourceBuffer!.updating && currentTime - start > this._options.maxCache) {
            this._sourceBuffer?.remove(0, currentTime - this._options.maxCache / 2)
          }
        }
      }
    })
  }

  /**
   * 将_bufsQueue中的数据添加到SourceBuffer中
   * @returns
   */
  private _catch() {
    if (
      !this._mediaSource ||
      !this._sourceBuffer ||
      this._sourceBuffer.updating ||
      !this._bufsQueue.length ||
      this._mediaSource.readyState !== 'open'
    ) {
      return requestIdleCallback(() => this._catch())
    }
    if (this._videoEl.error) {
      this._setupMSE()
      return requestIdleCallback(() => this._catch())
    }
    let frame: ArrayBuffer
    if (this._bufsQueue.length > 1) {
      const freeBuffer = this._bufsQueue.splice(0, this._bufsQueue.length)
      const length = freeBuffer.map((e) => e.byteLength).reduce((a, b) => a + b, 0)
      const buffer = new Uint8Array(length)
      let offset = 0
      for (const data of freeBuffer) {
        const frame = new Uint8Array(data)
        buffer.set(frame, offset)
        offset += data.byteLength
      }
      frame = buffer
    } else {
      frame = this._bufsQueue.shift() as ArrayBuffer
    }

    if (frame) {
      this._sourceBuffer.appendBuffer(frame)
    }
  }

  /**
   * 刷新播放时间为最新
   */
  public refresh() {
    if (this._videoEl && this._videoEl.buffered.length) {
      const end = this._videoEl.buffered.end(this._videoEl.buffered.length - 1)
      this._videoEl.currentTime = end
    }
  }

  private destroyMediaSource() {
    if (this._mediaSource) {
      URL.revokeObjectURL(this._videoEl.src)
      this._videoEl.src = ''
      if (this._mediaSource.readyState === 'open') {
        this._sourceBuffer && this._sourceBuffer.abort()

        this._sourceBuffer && this._mediaSource.removeSourceBuffer(this._sourceBuffer)
        this._mediaSource.endOfStream()
      }

      this._mediaSource = undefined
      this._sourceBuffer = undefined
    }
  }

  /**
   * 销毁
   */
  public destroy() {
    this._bufsQueue = []
    this._videoEl.pause()
    this._videoEl.currentTime = 0
    if (this._videoEl.parentElement === document.body) {
      document.body.removeChild(this._videoEl)
    }
    URL.revokeObjectURL(this._videoEl.src)

    this._mimeType = ''

    this._reqAnimationID && cancelAnimationFrame(this._reqAnimationID)

    this.destroyMediaSource()

    this.onRender = null
  }
}
