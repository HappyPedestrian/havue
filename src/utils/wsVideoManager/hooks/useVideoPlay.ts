import type { Ref, MaybeRef } from 'vue'
import type { WsVideoManager } from '../manager'
import { ref, computed, onBeforeUnmount, watchEffect, toValue, isRef, watch } from 'vue'
import { useElementVisibility, useResizeObserver } from '@vueuse/core'
import wsVideoPlayer from '../index'

/**
 * websocket视频流播放
 * @param wsUrl rtsp地址
 * @param isReady 是否可播放
 * @param wsVideoPlayerIns WsVideoManager实例
 * @param target canvas元素，可不提供，自动生成
 * @param autoResizeCanvas 是否自动监听canvas尺寸更改，更新canvas宽高, 不传为 true
 * @returns
 */
export function useVideoPlay(
  wsUrl: MaybeRef<string | undefined>,
  isReady: MaybeRef<boolean>,
  wsVideoPlayerIns: WsVideoManager = wsVideoPlayer,
  target?: MaybeRef<HTMLCanvasElement | undefined>,
  autoResizeCanvas?: MaybeRef<boolean>
) {
  let canvasRef: Ref<HTMLCanvasElement | undefined> = ref<HTMLCanvasElement>()
  if (target) {
    canvasRef = computed(() => {
      return isRef(target) ? toValue(target) : target
    })
  }

  const needResizeCanvas = computed(() => {
    return isRef(autoResizeCanvas) ? toValue(autoResizeCanvas) : autoResizeCanvas
  })

  /** 是否静音 */
  const isMuted = ref(true)
  /** 视频是否暂停播放 */
  const isPaused = ref(false)
  /** 上一次播放使用的url */
  const lastPreviewUrl = ref<string>()

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
          if (!canvasRef.value || !previewWsUrl.value) {
            return
          }
          const [entry] = entries
          const { width, height } = entry.contentRect
          canvasRef.value.width = width
          canvasRef.value.height = height
        })
        stopResizeObserver = stop
      }
    },
    {
      immediate: true
    }
  )

  /** 是否可添加到WsViderPlayer中 */
  const _isReady = computed<boolean>(() => {
    return isRef(isReady) ? toValue(isReady) : isReady
  })

  /** 预监WebSocket地址 */
  const previewWsUrl = computed<string>(() => {
    const _wsUrl = toValue(wsUrl)
    return _wsUrl || ''
  })

  onBeforeUnmount(() => {
    stopResizeObserver()
    if (!canvasRef.value) return
    // 删除收集的 canvas
    wsVideoPlayerIns.removeCanvas(canvasRef.value)
    isMuted.value = true
  })

  watchEffect(() => {
    if (!canvasRef.value) {
      return
    }
    if (canvasIsVisible.value && _isReady.value && previewWsUrl.value) {
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
        // 更新是否静音 / 视频暂停
        isMuted.value = wsVideoPlayer.getOneMutedState(previewWsUrl.value)
        isPaused.value = wsVideoPlayer.getOneVideoPausedState(previewWsUrl.value)
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
    isMuted.value = wsVideoPlayer.getOneMutedState(previewWsUrl.value)
  }

  /**
   * 设置当前视频音乐静音状态
   * @param muted 是否静音
   */
  function setAudioMutedState(muted: boolean) {
    wsVideoPlayer.setOneMutedState(previewWsUrl.value, muted)
    isMuted.value = wsVideoPlayer.getOneMutedState(previewWsUrl.value)
  }

  /**
   * 只播放此视频，其他暂停
   */
  function pauseOtherVideo() {
    wsVideoPlayer.playOneVideo(previewWsUrl.value)
    isPaused.value = wsVideoPlayer.getOneVideoPausedState(previewWsUrl.value)
  }

  /**
   * 设置此视频是否暂停播放
   * @param {boolean} paused 是否暂停播放
   */
  function setOneVideoPausedState(paused: boolean) {
    wsVideoPlayer.setOneVideoPausedState(previewWsUrl.value, paused)
    isPaused.value = wsVideoPlayer.getOneVideoPausedState(previewWsUrl.value)
  }

  /**
   * 设置所有视频是否暂停播放
   * @param {boolean} paused 是否暂停播放
   */
  function setAllVideoPausedState(paused: boolean) {
    wsVideoPlayer.setAllVideoPausedState(paused)
    isPaused.value = wsVideoPlayer.getOneVideoPausedState(previewWsUrl.value)
  }

  const refresh = () => {
    wsVideoPlayer.refresh(previewWsUrl.value)
  }

  return {
    canvasRef,
    isMuted,
    isPaused,
    pauseOtherAudio,
    setAudioMutedState,
    pauseOtherVideo,
    setOneVideoPausedState,
    setAllVideoPausedState,
    refresh
  }
}
