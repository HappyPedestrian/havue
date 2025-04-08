import MP4Box from './mp4box'
import { EventBus } from '@havue/shared'

// #region typedefine
export type RenderConstructorOptionType = {
  /** 当前播放currentTime和最新视频时长最多相差 秒数，默认0.3s */
  liveMaxLatency: number
  /** 最多缓存ws传输的未处理的buffer数据大小, 默认200kb */
  maxCacheBufByte: number
  /** 最多存储的时间，用于清除在currentTime之前x秒时间节点前的buffer数据, 默认10s */
  maxCache: number
}

export const WS_VIDEO_RENDER_DEFAULT_OPTIONS = Object.freeze({
  liveMaxLatency: 0.3,
  maxCacheBufByte: 200 * 1024,
  maxCache: 10
})

export enum AudioState {
  NOTMUTED = 'notmuted',
  MUTED = 'muted'
}

export enum VideoState {
  PLAY = 'play',
  PAUSE = 'pause'
}

export type VideoInfo = {
  width: number
  height: number
}

export enum RenderEventsEnum {
  AUDIO_STATE_CHANGE = 'audioStateChange',
  VIDEO_STATE_CHANGE = 'videoStateChange',
  VIDEO_INFO_UPDATE = 'videoInfoUpdate'
}

export type RenderEvents = {
  [RenderEventsEnum.AUDIO_STATE_CHANGE]: (s: AudioState) => void
  [RenderEventsEnum.VIDEO_STATE_CHANGE]: (s: VideoState) => void
  [RenderEventsEnum.VIDEO_INFO_UPDATE]: (info: VideoInfo) => void
}

// #endregion typedefine

// 调试代码
// let id = 0
// let curPosX = 0
// let curPosY = 0

export class Render extends EventBus<RenderEvents> {
  /** video元素 */
  private _videoEl: HTMLVideoElement | undefined = undefined
  /** mp4box 实例 */
  private _mp4box: MP4Box = MP4Box.createFile()
  /** mp4box onFragment获取的视频数据buffer数组 */
  private _audioBufsQueue: ArrayBuffer[] = []
  private _videoBufsQueue: ArrayBuffer[] = []
  /** MediaSource 实例 */
  private _mediaSource: MediaSource | undefined
  /** SourceBuffer 实例 */
  private _audioSourceBuffer: SourceBuffer | undefined
  private _videoSourceBuffer: SourceBuffer | undefined

  private _audioTrackId: number | undefined
  private _videoTrackId: number | undefined
  /** 用于MediaSource的mimeType */
  private _mimeType: string = ''
  private _audioMimeType: string = ''
  private _videoMimeType: string = ''
  /** 是否暂停播放 */
  private _paused: boolean = false
  private _options: RenderConstructorOptionType

  private _cacheAnimationID: number | undefined = undefined

  /** fmp4初始化片段是否已经添加 */
  private _isAudioInitSegmentAdded: boolean = false
  private _isVideoInitSegmentAdded: boolean = false
  private _offset: number = 0

  // 调试代码
  // private divID = ''

  constructor(options: Partial<RenderConstructorOptionType> = {}) {
    super()
    this._options = options
      ? Object.assign({}, WS_VIDEO_RENDER_DEFAULT_OPTIONS, options)
      : WS_VIDEO_RENDER_DEFAULT_OPTIONS
    this._mp4box.onReady = this._onMp4boxReady.bind(this)
    this._mp4box.onSegment = this._onSegment.bind(this)
    this._setupVideo()
  }

  get muted(): boolean {
    return this._videoEl?.muted || false
  }

  set muted(val: boolean) {
    if (this._videoEl) {
      this._videoEl.muted = val
    }
  }

  set paused(paused: boolean) {
    this._paused = paused
    if (paused) {
      this._videoEl?.pause()
    } else {
      this._videoEl?.play()
    }
  }

  get paused(): boolean {
    return this._paused
  }

  get videoEl(): HTMLVideoElement | undefined {
    return this._videoEl
  }

  /** 更新实例配置 */
  public updateOptions(option: Partial<RenderConstructorOptionType> = {}) {
    Object.assign(this._options, {
      ...option
    })
  }

  /**
   * 添加视频流buffer数据
   * @param buf
   */
  public appendMediaBuffer(bufs: Array<ArrayBuffer & { fileStart: number }>) {
    if (this._paused) {
      return
    }
    bufs.forEach((b) => {
      b.fileStart = this._offset
      this._offset += b.byteLength
      this._mp4box.appendBuffer(b)
    })
    return
  }

  /**
   * mp4box解析完成
   * @param info mp4box解析信息
   */
  private _onMp4boxReady(info: any) {
    console.log('onMp4boxReady', info)
    if (!info.isFragmented) {
      console.error('not fragmented mp4')
      return
    }
    this._mimeType = info.mime

    try {
      const { width, height } = info.videoTracks[0].video
      this.emit(RenderEventsEnum.VIDEO_INFO_UPDATE, {
        width,
        height
      })
      const audioTrack = info.audioTracks[0]
      const videoTrack = info.videoTracks[0]

      if (audioTrack) {
        this._audioMimeType = `audio/mp4; codecs="${audioTrack.codec}"`
        this._audioTrackId = audioTrack.id
        this._mp4box.setSegmentOptions(audioTrack.id, undefined, {
          nbSamples: 100
        })
      }

      if (videoTrack) {
        this._videoMimeType = `video/mp4; codecs="${videoTrack.codec}"`
        this._videoTrackId = videoTrack.id
        this._mp4box.setSegmentOptions(videoTrack.id, undefined, {
          nbSamples: 100
        })
      }

      const initSegments = this._mp4box.initializeSegmentation()
      for (const seg of initSegments) {
        if (audioTrack && seg.id === audioTrack.id) {
          this._audioBufsQueue.push(seg.buffer)
        } else if (videoTrack && seg.id === videoTrack.id) {
          this._videoBufsQueue.push(seg.buffer)
        }
      }
    } catch (error) {
      console.error(error)
    }
    this._setupMSE()
    this._mp4box.start()
  }

  private _onSegment(id: number, __: any, buffer: ArrayBuffer, sampleNumber: number) {
    const isAudio = id === this._audioTrackId
    const isVideo = id === this._videoTrackId
    const bufQueue = isAudio ? this._audioBufsQueue : isVideo ? this._videoBufsQueue : null
    if (!bufQueue) {
      return
    }
    const sourceBuffer = isVideo ? this._videoSourceBuffer : this._audioSourceBuffer
    bufQueue.push(buffer)
    // 清除已使用的samples
    this._mp4box.releaseUsedSamples(id, sampleNumber)
    this._mp4box.removeUsedSamples(id)
    const segmentAdded = isAudio ? this._isAudioInitSegmentAdded : this._isVideoInitSegmentAdded
    if (segmentAdded && sourceBuffer && !this._videoEl?.paused && bufQueue.length > 2) {
      const len = bufQueue.length
      const maxTotal = this._options.maxCacheBufByte
      let lastIndex = len - 1
      let total = 0
      for (let i = len - 1; i > 0; i--) {
        total += bufQueue[i].byteLength
        lastIndex = i
        if (total >= maxTotal) {
          bufQueue.splice(0, lastIndex)
          break
        }
      }
    }
    this._cacheAnimationID && cancelAnimationFrame(this._cacheAnimationID)
    this._cacheAnimationID = undefined
    this._cache(isVideo)
  }

  /**
   * 初始化视频元素
   */
  private _setupVideo() {
    this._videoEl = document.createElement('video')
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
        this._videoEl?.play()
      }
    })

    this._videoEl.addEventListener('play', () => {
      this.emit(RenderEventsEnum.VIDEO_STATE_CHANGE, VideoState.PLAY)
    })

    this._videoEl.addEventListener('pause', () => {
      this.emit(RenderEventsEnum.VIDEO_STATE_CHANGE, VideoState.PAUSE)
    })

    this._videoEl.addEventListener('volumechange', () => {
      this.emit(RenderEventsEnum.AUDIO_STATE_CHANGE, this._videoEl?.muted ? AudioState.MUTED : AudioState.NOTMUTED)
    })

    this._videoEl.addEventListener('error', (error) => {
      console.error('video error', error)
      // setTimeout(() => {
      //   this._mediaSource && this._setupMSE()
      // }, 500)
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
    // if (curPosY >= 400) {
    //   curPosY = 0
    //   curPosX += 200
    // }
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
    if (!this._videoEl) {
      return
    }
    this.destroyMediaSource()
    this._mediaSource = new MediaSource()
    URL.revokeObjectURL(this._videoEl.src)
    this._videoEl.src = URL.createObjectURL(this._mediaSource)

    this._mediaSource.addEventListener('sourceopen', () => {
      if (!this._mediaSource) {
        return
      }

      // 音频轨
      if (this._audioMimeType) {
        this._audioSourceBuffer = this._mediaSource.addSourceBuffer(this._audioMimeType)
        this._audioSourceBuffer.mode = 'sequence'
        this._setupSourceBuffer(this._audioSourceBuffer, false)
      }

      // 视频轨
      if (this._videoMimeType) {
        this._videoSourceBuffer = this._mediaSource.addSourceBuffer(this._videoMimeType)
        this._videoSourceBuffer.mode = 'sequence'
        this._setupSourceBuffer(this._videoSourceBuffer, true)
      }
    })
  }

  private _setupSourceBuffer(sourceBuffer: SourceBuffer, isVideo: boolean = false) {
    sourceBuffer.onupdateend = () => {
      if (
        !this._videoEl ||
        !sourceBuffer ||
        this._mediaSource?.readyState !== 'open' ||
        ![...this._mediaSource.sourceBuffers].includes(sourceBuffer)
      ) {
        return
      }
      const currentTime = this._videoEl.currentTime
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
          const lastIndex = bufferedLen - 1
          if (currentTime < sourceBuffer.buffered.start(lastIndex)) {
            this._videoEl.currentTime = sourceBuffer.buffered.start(lastIndex)
          }

          const delBufEnd = sourceBuffer.buffered.end(lastIndex - 1)
          if (!sourceBuffer!.updating && currentTime > delBufEnd) {
            sourceBuffer?.remove(0, delBufEnd)
          }
        }

        // 调试代码
        // innerHTML += ` - start:${sourceBuffer.buffered.start(
        //   sourceBuffer.buffered.length - 1
        // )} - end:${sourceBuffer.buffered.end(sourceBuffer.buffered.length - 1)} <br/>`
        // innerHTML += ` - currentTime: ${currentTime}`
        // div && (div.innerHTML = innerHTML)

        bufferedLen = sourceBuffer.buffered.length
        const start = sourceBuffer.buffered.start(bufferedLen - 1)
        const end = sourceBuffer.buffered.end(bufferedLen - 1)

        if (isVideo) {
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
        }

        // 移除当前时间之前的buffer
        if (!sourceBuffer!.updating && currentTime - start > this._options.maxCache) {
          sourceBuffer?.remove(0, currentTime - this._options.maxCache / 2)
        }
      }
    }
  }

  /**
   * 将_bufsQueue中的数据添加到SourceBuffer中
   * @returns
   */
  private _cache(isVideo: boolean = false) {
    if (!this._videoEl) {
      return
    }
    const queue = isVideo ? this._videoBufsQueue : this._audioBufsQueue
    const sourceBuffer = isVideo ? this._videoSourceBuffer : this._audioSourceBuffer
    if (
      !this._mediaSource ||
      !sourceBuffer ||
      sourceBuffer.updating ||
      !queue.length ||
      this._mediaSource.readyState !== 'open'
    ) {
      this._cacheAnimationID === undefined &&
        (this._cacheAnimationID = requestAnimationFrame(() => this._cache(isVideo)))
      return
    }
    if (this._videoEl.error) {
      this._setupMSE()
      return (
        this._cacheAnimationID === undefined &&
        (this._cacheAnimationID = requestAnimationFrame(() => this._cache(isVideo)))
      )
    }
    this._cacheAnimationID = undefined
    let frame: Uint8Array
    if (queue.length > 1) {
      const freeBuffer = queue.splice(0, queue.length)
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
      frame = new Uint8Array(queue.shift() || [])
    }

    if (frame) {
      if (isVideo) {
        !this._isVideoInitSegmentAdded && (this._isVideoInitSegmentAdded = true)
      } else {
        !this._isAudioInitSegmentAdded && (this._isAudioInitSegmentAdded = true)
      }
      sourceBuffer.appendBuffer(frame)
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

  /** 重置解析的视频mime type */
  public resetMimeType() {
    this.destroyMp4box()
    this.destroyMediaSource()
    if (this._videoEl) {
      this._videoEl.src = ''
    }
    this._mp4box = MP4Box.createFile()
    this._mp4box.onReady = this._onMp4boxReady.bind(this)
    this._mp4box.onSegment = this._onSegment.bind(this)
  }

  private destroyMediaSource() {
    if (this._mediaSource) {
      if (this._videoEl) {
        URL.revokeObjectURL(this._videoEl?.src || '')
        this._videoEl.src = ''
      }
      if (this._mediaSource.readyState === 'open') {
        if (this._audioSourceBuffer) {
          this._audioSourceBuffer.abort()
          this._mediaSource.removeSourceBuffer(this._audioSourceBuffer)
        }
        if (this._videoSourceBuffer) {
          this._videoSourceBuffer.abort()
          this._mediaSource.removeSourceBuffer(this._videoSourceBuffer)
        }
        this._mediaSource.endOfStream()
      }

      this._mediaSource = undefined
      this._audioSourceBuffer = undefined
      this._videoSourceBuffer = undefined
    }
  }

  public destroyMp4box() {
    this._audioTrackId = undefined
    this._videoTrackId = undefined
    this._mimeType = ''
    this._audioMimeType = ''
    this._videoMimeType = ''
    this._isAudioInitSegmentAdded = false
    this._isVideoInitSegmentAdded = false
    this._audioBufsQueue.length = 0
    this._videoBufsQueue.length = 0
    this._offset = 0
    this._mp4box.stop()
    this._mp4box.flush()
    this._mp4box.destroy()
    this._mp4box = null
  }

  /**
   * 销毁
   */
  public destroy() {
    if (this._videoEl) {
      this._videoEl.pause()
      this._videoEl.currentTime = 0
      if (this._videoEl.parentElement === document.body) {
        document.body.removeChild(this._videoEl)
      }
      URL.revokeObjectURL(this._videoEl.src)
      this._videoEl.src = ''
      this._videoEl = undefined
    }

    this._cacheAnimationID && cancelAnimationFrame(this._cacheAnimationID)
    this._cacheAnimationID = undefined
    this.destroyMp4box()
    this.destroyMediaSource()
  }
}
