import type { Ref, MaybeRef } from 'vue'
import type { VideoInfo } from '../render'
import { WsVideoManagerEventEnums, type WsVideoManager } from '../manager'
import { ref, computed, onBeforeUnmount, toValue, isRef, watch } from 'vue'
import { useElementVisibility, useResizeObserver } from '@vueuse/core'
import wsVideoPlayer from '../index'
import { AudioState, VideoState } from '../render'

export type CanvasResizeOption = {
  /** 是否启用自动更新canvas width 和 height属性，默认为true */
  enable?: boolean
  /** 设置canvas width 和 height时，
   * 缩放的比例，即元素实际尺寸乘以scale，
   * 放大是为了画面更清晰
   * 默认 1
   */
  scale?: number
  /** 限制canvas width最大值，默认1920 */
  maxWidth?: number
  /** 限制canvas height最大值，默认1080 */
  maxHeight?: number
}

export type ParamsOptions = {
  /** websocket 地址 */
  wsUrl: MaybeRef<string | undefined>
  /** 是否播放视频 */
  isReady: MaybeRef<boolean>
  /** 使用的WsVideoManager 实例 默认为wsVideoPlayer */
  wsVideoPlayerIns?: WsVideoManager
  /** 视频渲染到的canvas元素, 不传会返回一个元素引用变量：canvasRef */
  target?: MaybeRef<HTMLCanvasElement | undefined>
  /** 是否自动更新canvas width和height属性的配置， 默认为 DEFAULT_RESIZE_OPTIONS */
  canvasResize?: MaybeRef<CanvasResizeOption | undefined>
  /** 视口中元素不可见时断开连接， 默认为true */
  closeOnHidden?: MaybeRef<boolean>
}

// canvasResize 默认值
export const DEFAULT_RESIZE_OPTIONS = Object.freeze({
  enable: true,
  scale: 1,
  maxWidth: 1920,
  maxHeight: 1080
})

export type ReturnType = {
  /** canvas引用 */
  canvasRef: Ref<HTMLCanvasElement | undefined>
  /** 是否静音 */
  isMuted: Ref<boolean>
  /** 是否暂停 */
  isPaused: Ref<boolean>
  /** 视频信息 */
  videoInfo: Ref<VideoInfo>
  /** 已经连接的WebSocket地址列表 */
  linkedWsUrlList: Ref<string[]>
  /** 视频流地址是否已添加 */
  isLinked: Ref<boolean>
  /** 是否达到websocket拉流数最大值 */
  isReachConnectLimit: Ref<boolean>
  /** 暂停其他WebSocket视频流的音频播放 */
  pauseOtherAudio: () => void
  /** 设置当前WebSocket视频流的音频是否暂停 */
  setAudioMutedState: (muted: boolean) => void
  /** 暂停其他WebSocket视频流的视频播放 */
  pauseOtherVideo: () => void
  /** 设置当前WebSocket视频流的视频是否暂停 */
  setOneVideoPausedState: (paused: boolean) => void
  /** 设置所有WebSocket视频流的视频是否暂停 */
  setAllVideoPausedState: (paused: boolean) => void
  /** 刷新当前WebSocket视频流的时间 */
  refresh: () => void
}

/**
 * websocket视频流播放
 * @param {ParamsOptions} options 配置项
 * @returns
 */
export function useVideoPlay(options: ParamsOptions): ReturnType {
  let canvasRef: Ref<HTMLCanvasElement | undefined> = ref<HTMLCanvasElement>()

  const { wsUrl, isReady, target, wsVideoPlayerIns = wsVideoPlayer, canvasResize, closeOnHidden } = options

  if (target) {
    canvasRef = computed<HTMLCanvasElement | undefined>(() => {
      return isRef(target) ? toValue(target) : target
    })
  }

  /** 是否可添加到WsViderPlayer中 */
  const _isReady = computed<boolean>(() => {
    return isRef(isReady) ? toValue(isReady) : isReady
  })

  /** 预监WebSocket地址 */
  const previewWsUrl = computed<string>(() => {
    const url = wsUrl
    const _wsUrl = (isRef(url) ? toValue(url) : url) || ''
    return _wsUrl
  })

  const _canvasResizeOpt = computed(() => {
    const canvasResizeOpt = isRef(canvasResize) ? toValue(canvasResize) : canvasResize || {}

    const opt = Object.assign({}, DEFAULT_RESIZE_OPTIONS, canvasResizeOpt || {})
    return opt
  })

  const needResizeCanvas = computed(() => {
    return _canvasResizeOpt.value.enable
  })

  const _closeOnHidden = computed<boolean>(() => {
    const closeOpt = isRef(closeOnHidden) ? toValue(closeOnHidden) : closeOnHidden
    return closeOpt === undefined ? true : closeOpt
  })

  /** 是否静音 */
  const isMuted = ref(true)
  /** 视频是否暂停播放 */
  const isPaused = ref(false)
  const videoInfo = ref<VideoInfo>({
    width: 0,
    height: 0
  })
  /** 上一次播放使用的url */
  const lastPreviewUrl = ref<string>()
  /** 已连接的websocket地址 */
  const linkedWsUrlList = ref<string[]>([...wsVideoPlayer.linkedUrlList])

  /** 预监地址是否已添加 */
  const isLinked = computed(() => {
    return linkedWsUrlList.value.includes(previewWsUrl.value)
  })

  const connectLimit = wsVideoPlayer.connectLimit

  /** 达到websocket拉流数最大值 */
  const isReachConnectLimit = computed(() => {
    return linkedWsUrlList.value.length >= connectLimit
  })

  wsVideoPlayer.on(WsVideoManagerEventEnums.WS_URL_CHANGE, (urls) => {
    linkedWsUrlList.value = [...urls]
  })

  wsVideoPlayer.on(WsVideoManagerEventEnums.AUDIO_STATE_CHANGE, (url, state) => {
    if (url === previewWsUrl.value) {
      console.log('音频状态更改', url, state)
      isMuted.value = state === AudioState.MUTED
    }
  })

  wsVideoPlayer.on(WsVideoManagerEventEnums.VIDEO_STATE_CHANGE, (url, state) => {
    if (url === previewWsUrl.value) {
      console.log('视频状态更改', url, state)
      isPaused.value = state === VideoState.PAUSE
    }
  })

  wsVideoPlayer.on(WsVideoManagerEventEnums.VIDEO_INFO_UPDATE, (url, info) => {
    if (url === previewWsUrl.value) {
      videoInfo.value = {
        ...info
      }
    }
  })

  /** canvas在视口中 */
  const canvasIsVisible = useElementVisibility(canvasRef)

  let stopResizeObserver: () => void = () => {}

  watch(
    needResizeCanvas,
    (val) => {
      stopResizeObserver && stopResizeObserver()
      if (val) {
        /** 监听尺寸变化，更新canvas width/height */
        const { stop } = useResizeObserver(canvasRef, (entries) => {
          if (!canvasRef.value) {
            return
          }
          const [entry] = entries
          const { width, height } = entry.contentRect
          const { scale, maxWidth, maxHeight } = _canvasResizeOpt.value

          // 乘以scale
          let comWidth = width * scale
          let comHeight = height * scale

          /**
           * 如果超出最大值，设置为
           * 能被maxWidth*maxHeight的矩形中能包含的
           * 最大矩形宽高， (保持canvas宽高比)
           */
          const canvasRate = width / height
          if (comWidth > maxWidth || comHeight > maxHeight) {
            const optionRate = maxWidth / maxHeight

            comWidth = canvasRate > optionRate ? maxWidth : maxHeight * canvasRate
            comHeight = canvasRate > optionRate ? maxWidth / canvasRate : maxHeight
          }
          // 限制最大值
          canvasRef.value.width = comWidth
          canvasRef.value.height = comHeight
        })
        stopResizeObserver = stop
      }
    },
    {
      immediate: true
    }
  )

  onBeforeUnmount(() => {
    stopResizeObserver()
    if (!canvasRef.value) return
    // 删除收集的 canvas
    wsVideoPlayerIns.removeCanvas(canvasRef.value)
    isMuted.value = true
  })

  const canPreview = computed(() => {
    if (_closeOnHidden.value) {
      return canvasIsVisible.value && _isReady.value && previewWsUrl.value
    }
    return _isReady.value && previewWsUrl.value
  })

  watch([canvasRef, canPreview, linkedWsUrlList], () => {
    if (!canvasRef.value) {
      return
    }
    if (canPreview.value) {
      // 如果预监地址更改，移除canvas
      if (
        lastPreviewUrl.value &&
        previewWsUrl.value !== lastPreviewUrl.value &&
        wsVideoPlayerIns.isCanvasExist(canvasRef.value)
      ) {
        wsVideoPlayerIns.removeCanvas(canvasRef.value)
      }

      if (!wsVideoPlayerIns.isCanvasExist(canvasRef.value)) {
        // 新增canvas
        wsVideoPlayerIns.addCanvas(canvasRef.value, previewWsUrl.value)
        lastPreviewUrl.value = previewWsUrl.value
      }
    } else {
      if (wsVideoPlayerIns.isCanvasExist(canvasRef.value)) {
        // 移除canvas
        wsVideoPlayerIns.removeCanvas(canvasRef.value)
        isMuted.value = true
        isPaused.value = false
      }
    }
  })

  /** 播放当前音乐，静音其他音乐 */
  function pauseOtherAudio() {
    wsVideoPlayer.playOneAudio(previewWsUrl.value)
  }

  /**
   * 设置当前视频音乐静音状态
   * @param muted 是否静音
   */
  function setAudioMutedState(muted: boolean) {
    wsVideoPlayer.setOneMutedState(previewWsUrl.value, muted)
  }

  /**
   * 只播放此视频，其他暂停
   */
  function pauseOtherVideo() {
    wsVideoPlayer.playOneVideo(previewWsUrl.value)
  }

  /**
   * 设置此视频是否暂停播放
   * @param {boolean} paused 是否暂停播放
   */
  function setOneVideoPausedState(paused: boolean) {
    wsVideoPlayer.setOneVideoPausedState(previewWsUrl.value, paused)
  }

  /**
   * 设置所有视频是否暂停播放
   * @param {boolean} paused 是否暂停播放
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
