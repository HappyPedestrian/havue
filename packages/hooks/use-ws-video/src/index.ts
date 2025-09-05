// #region typeimport
import type { Ref, MaybeRef } from 'vue'
import type { RenderConstructorOptionType, VideoInfo, WsVideoManager } from '@havue/ws-video-manager'
// #endregion typeimport
import { ref, computed, onBeforeUnmount, toValue, isRef, watch } from 'vue'
import { useElementVisibility, useResizeObserver } from '@vueuse/core'
import wsVideoPlayer, { WsVideoManagerEventEnums, AudioState, VideoState } from '@havue/ws-video-manager'

// #region typedefine
export type UseWsVideoCanvasResizeOption = {
  /**
   * 是否启用自动更新canvas width 和 height属性，默认为true
   * Whether to enable auto-updating canvas width and height properties (true by default)
   */
  enable?: boolean
  /**
   * 设置canvas width 和 height时，
   * 大小为元素实际尺寸乘以scale，
   * 放大是为了画面更清晰
   * 默认 1
   *
   * When setting canvas width and height,
   * the size is multiplied by the actual size of the element.
   * The size is enlarged for clearer picture.
   * The default is 1
   */
  scale?: number
  /** 限制canvas width最大值，默认1920 | Limit the maximum canvas width, default 1920 */
  maxWidth?: number
  /** 限制canvas height最大值，默认1080 | Limit the maximum canvas height, default 1080 */
  maxHeight?: number
}

export type UseWsVideoParamsOptions = {
  /** websocket url */
  wsUrl: MaybeRef<string | undefined>
  /** 是否可播放视频 | Whether the video can be played */
  isReady: MaybeRef<boolean>
  /** 使用的WsVideoManager 实例 默认为wsVideoPlayer | The WsVideoManager instance used defaults to wsVideoPlayer */
  wsVideoPlayerIns?: WsVideoManager
  /**
   * 视频渲染到的canvas元素, 不传会返回一个元素引用变量：canvasRef
   * The canvas element to which the video is rendered will return an element reference variable: canvasRef
   */
  target?: MaybeRef<HTMLCanvasElement | undefined>
  /**
   * 是否自动更新canvas width和height属性的配置， 默认为 USE_WS_VIDEO_DEFAULT_RESIZE_OPTIONS
   * Whether the canvas width and height properties should be automatically updated. Defaults to USE_WS_VIDEO_DEFAULT_RESIZE_OPTIONS
   */
  canvasResize?: MaybeRef<UseWsVideoCanvasResizeOption | undefined>
  /**
   * 视口中元素不可见时断开连接， 默认为true
   * Disconnect when the element in the viewport is not visible; defaults to true
   */
  closeOnHidden?: MaybeRef<boolean>
  /** 自定义Render配置 | Customize the Render configuration */
  renderOptions?: MaybeRef<Partial<RenderConstructorOptionType>>
}

// canvasResize 默认值
export const USE_WS_VIDEO_DEFAULT_RESIZE_OPTIONS = Object.freeze({
  enable: true,
  scale: 1,
  maxWidth: 1920,
  maxHeight: 1080
})

export type UseWsVideoReturnType = {
  /** canvas ref */
  canvasRef: Ref<HTMLCanvasElement | undefined>
  /** 是否静音 | Muted or not */
  isMuted: Ref<boolean>
  /** 是否暂停 | Paused or not */
  isPaused: Ref<boolean>
  /** 视频信息 | Video info */
  videoInfo: Ref<VideoInfo>
  /** 已经连接的WebSocket地址列表 | A list of connected WebSockets */
  linkedWsUrlList: Ref<string[]>
  /** 视频流地址是否已添加 | Whether the video stream address has been added */
  isLinked: Ref<boolean>
  /**
   * 是否达到websocket拉流数最大值
   * Whether the maximum number of websocket pull streams has been reached
   */
  isReachConnectLimit: Ref<boolean>
  /**
   * 暂停其他WebSocket视频流的音频播放
   * Pause audio playback of other WebSocket video streams
   */
  pauseOtherAudio: () => void
  /**
   * 设置当前WebSocket视频流的音频是否暂停
   * Sets whether the audio of the current WebSocket video stream should be paused
   */
  setAudioMutedState: (muted: boolean) => void
  /**
   * 暂停其他WebSocket视频流的视频播放
   * Pause video playback of other WebSocket video streams
   */
  pauseOtherVideo: () => void
  /**
   * 设置当前WebSocket视频流的视频是否暂停
   * Sets whether the current WebSocket video stream should pause the video
   */
  setOneVideoPausedState: (paused: boolean) => void
  /**
   * 设置所有WebSocket视频流的视频是否暂停
   * Sets whether the video of all WebSocket video streams should be paused
   */
  setAllVideoPausedState: (paused: boolean) => void
  /**
   * 刷新当前WebSocket视频流的时间，如果连接断开会进行重连
   * Time to refresh the current WebSocket video stream and reconnect if the connection is dropped
   */
  refresh: () => void
}
// #endregion typedefine

/**
 * websocket视频流播放 | websocket video streaming
 * @param {UseWsVideoParamsOptions} options
 * @returns
 */
export function useWsVideo(options: UseWsVideoParamsOptions): UseWsVideoReturnType {
  let canvasRef: Ref<HTMLCanvasElement | undefined> = ref<HTMLCanvasElement>()

  const {
    wsUrl,
    isReady,
    target,
    wsVideoPlayerIns = wsVideoPlayer,
    canvasResize,
    closeOnHidden,
    renderOptions
  } = options

  if (target) {
    canvasRef = computed<HTMLCanvasElement | undefined>(() => {
      return isRef(target) ? toValue(target) : target
    })
  }

  /** 是否可添加到WsViderPlayer中 | Whether it can be added to WsViderPlayer */
  const _isReady = computed<boolean>(() => {
    return isRef(isReady) ? toValue(isReady) : isReady
  })

  /** WebSocket url */
  const previewWsUrl = computed<string>(() => {
    const url = wsUrl
    const _wsUrl = (isRef(url) ? toValue(url) : url) || ''
    return _wsUrl
  })

  const _canvasResizeOpt = computed(() => {
    const canvasResizeOpt = isRef(canvasResize) ? toValue(canvasResize) : canvasResize || {}

    const opt = Object.assign({}, USE_WS_VIDEO_DEFAULT_RESIZE_OPTIONS, canvasResizeOpt || {})
    return opt
  })

  const _closeOnHidden = computed<boolean>(() => {
    const closeOpt = isRef(closeOnHidden) ? toValue(closeOnHidden) : closeOnHidden
    return closeOpt === undefined ? true : closeOpt
  })

  const _renderOptions = computed<Partial<RenderConstructorOptionType> | undefined>(() => {
    const renderOpt = isRef(renderOptions) ? toValue(renderOptions) : renderOptions || undefined

    return renderOpt
  })

  /** 是否静音 | Muted or not */
  const isMuted = ref(true)
  /** 视频是否暂停播放 | Whether the video is paused or not */
  const isPaused = ref(false)
  const videoInfo = ref<VideoInfo>({
    width: 0,
    height: 0
  })
  /** 上一次播放使用的url | The url used for the last play */
  const lastPreviewUrl = ref<string>()
  /** 已连接的websocket地址 | The address of the connected websocket*/
  const linkedWsUrlList = ref<string[]>([...wsVideoPlayer.linkedUrlList])

  /** websocket是否已添加 | Whether websocket has been added */
  const isLinked = computed(() => {
    return linkedWsUrlList.value.includes(previewWsUrl.value)
  })

  const connectLimit = wsVideoPlayer.connectLimit

  /** 达到websocket拉流数最大值 | The maximum number of websocket pull streams is reached */
  const isReachConnectLimit = computed(() => {
    return linkedWsUrlList.value.length >= connectLimit
  })

  function handleWsUrlChange(urls: string[]) {
    linkedWsUrlList.value = [...urls]
  }

  function handleAudioStateChange(url: string, state: AudioState) {
    if (url === previewWsUrl.value) {
      console.log('Audio state change', url, state)
      isMuted.value = state === AudioState.MUTED
    }
  }

  function handleVideoStateChange(url: string, state: VideoState) {
    if (url === previewWsUrl.value) {
      console.log('Video state change', url, state)
      isPaused.value = state === VideoState.PAUSE
    }
  }

  function handleVideoInfoUpdate(url: string, info: VideoInfo) {
    if (url === previewWsUrl.value) {
      videoInfo.value = {
        ...info
      }
    }
  }

  wsVideoPlayer.on(WsVideoManagerEventEnums.WS_URL_CHANGE, handleWsUrlChange)

  wsVideoPlayer.on(WsVideoManagerEventEnums.AUDIO_STATE_CHANGE, handleAudioStateChange)

  wsVideoPlayer.on(WsVideoManagerEventEnums.VIDEO_STATE_CHANGE, handleVideoStateChange)

  wsVideoPlayer.on(WsVideoManagerEventEnums.VIDEO_INFO_UPDATE, handleVideoInfoUpdate)

  /** canvas在视口中 | canvas is in the viewport */
  const canvasIsVisible = useElementVisibility(canvasRef)

  let stopResizeObserver: () => void = () => {}

  watch(
    _canvasResizeOpt,
    (val) => {
      stopResizeObserver && stopResizeObserver()
      if (val.enable) {
        /** 监听尺寸变化，更新canvas width/height | Listen for size changes and update canvas width/height */
        const { stop } = useResizeObserver(canvasRef, (entries) => {
          if (!canvasRef.value) {
            return
          }
          const [entry] = entries
          const { width, height } = entry.contentRect
          const { scale, maxWidth, maxHeight } = _canvasResizeOpt.value

          let comWidth = width * scale
          let comHeight = height * scale

          /**
           * 如果超出最大值，设置为
           * 能被maxWidth*maxHeight的矩形中能包含的
           * 最大矩形宽高， (保持canvas宽高比)
           *
           * If the maximum value is exceeded,
           * it is set to the maximum width and height of the rectangle
           *  that can be contained in the maxWidth*maxHeight rectangle
           * (keeping the canvas aspect ratio).
           */
          const canvasRate = width / height
          if (comWidth > maxWidth || comHeight > maxHeight) {
            const optionRate = maxWidth / maxHeight

            comWidth = canvasRate > optionRate ? maxWidth : maxHeight * canvasRate
            comHeight = canvasRate > optionRate ? maxWidth / canvasRate : maxHeight
          }
          // 限制最大值 | Limiting the maximum value
          canvasRef.value.width = comWidth
          canvasRef.value.height = comHeight
        })
        stopResizeObserver = stop
      }
    },
    {
      immediate: true,
      deep: true
    }
  )

  watch(
    _renderOptions,
    () => {
      if (_renderOptions.value && isLinked.value) {
        wsVideoPlayerIns.updateRenderOptions(previewWsUrl.value, _renderOptions.value)
      }
    },
    {
      deep: true
    }
  )

  onBeforeUnmount(() => {
    stopResizeObserver()
    wsVideoPlayer.off(WsVideoManagerEventEnums.WS_URL_CHANGE, handleWsUrlChange)

    wsVideoPlayer.off(WsVideoManagerEventEnums.AUDIO_STATE_CHANGE, handleAudioStateChange)

    wsVideoPlayer.off(WsVideoManagerEventEnums.VIDEO_STATE_CHANGE, handleVideoStateChange)

    wsVideoPlayer.off(WsVideoManagerEventEnums.VIDEO_INFO_UPDATE, handleVideoInfoUpdate)
    if (!canvasRef.value) return
    // Remove canvas
    wsVideoPlayerIns.removeCanvas(canvasRef.value)
    isMuted.value = true
  })

  const canPreview = computed(() => {
    if (_closeOnHidden.value) {
      return canvasIsVisible.value && _isReady.value && previewWsUrl.value
    }
    return _isReady.value && previewWsUrl.value
  })

  watch([canvasRef, canPreview, linkedWsUrlList, previewWsUrl], () => {
    if (!canvasRef.value) {
      return
    }
    if (canPreview.value) {
      // 如果websocket地址更改，移除canvas | If the websocket address changes, remove the canvas
      if (
        lastPreviewUrl.value &&
        previewWsUrl.value !== lastPreviewUrl.value &&
        wsVideoPlayerIns.isCanvasExist(canvasRef.value)
      ) {
        wsVideoPlayerIns.removeCanvas(canvasRef.value)
      }

      if (!wsVideoPlayerIns.isCanvasExist(canvasRef.value)) {
        // add canvas
        wsVideoPlayerIns.addCanvas(canvasRef.value, previewWsUrl.value, _renderOptions.value)
        lastPreviewUrl.value = previewWsUrl.value
      }
    } else {
      if (wsVideoPlayerIns.isCanvasExist(canvasRef.value)) {
        // remvoe canvas
        wsVideoPlayerIns.removeCanvas(canvasRef.value)
        isMuted.value = true
        isPaused.value = false
      }
    }
  })

  /** 播放当前流音频，静音其他流音频 | Play the current stream and mute the other streams */
  function pauseOtherAudio() {
    wsVideoPlayer.playOneAudio(previewWsUrl.value)
  }

  /**
   * 设置当前视频静音状态 | Set the mute state of the current video
   * @param muted 是否静音 | Muted or not
   */
  function setAudioMutedState(muted: boolean) {
    wsVideoPlayer.setOneMutedState(previewWsUrl.value, muted)
  }

  /**
   * 只播放此视频，其他暂停 | Play only this video, pause the rest
   */
  function pauseOtherVideo() {
    wsVideoPlayer.playOneVideo(previewWsUrl.value)
  }

  /**
   * 设置此视频是否暂停播放 | Sets whether this video should be paused
   * @param {boolean} paused 是否暂停播放 | Whether to pause playback
   */
  function setOneVideoPausedState(paused: boolean) {
    wsVideoPlayer.setOneVideoPausedState(previewWsUrl.value, paused)
  }

  /**
   * 设置所有视频是否暂停播放 | Sets whether all videos should be paused
   * @param {boolean} paused 是否暂停播放 | Whether to pause playback
   */
  function setAllVideoPausedState(paused: boolean) {
    wsVideoPlayer.setAllVideoPausedState(paused)
  }

  const refresh = () => {
    wsVideoPlayer.refresh(previewWsUrl.value)
  }

  return {
    canvasRef,
    isMuted,
    isPaused,
    videoInfo,
    linkedWsUrlList,
    isLinked,
    isReachConnectLimit,
    pauseOtherAudio,
    setAudioMutedState,
    pauseOtherVideo,
    setOneVideoPausedState,
    setAllVideoPausedState,
    refresh
  }
}
