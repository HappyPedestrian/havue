import type { WsVideoManager } from '../manager'
import { ref, computed, onBeforeUnmount, watchEffect, toValue, isRef, type MaybeRef, watch } from 'vue'
import { useElementVisibility, useResizeObserver } from '@vueuse/core'
import wsVideoPlayer from '../index'

/**
 * websocket视频流播放
 * @param wsUrl rtsp地址
 * @param isReady 是否可播放
 * @param wsVideoPlayerIns WsVideoManager实例
 * @param target canvas元素，可不提供，自动生成
 * @returns
 */
export function useVideoPlay(
  wsUrl: MaybeRef<string | undefined>,
  isReady: MaybeRef<boolean>,
  wsVideoPlayerIns: WsVideoManager = wsVideoPlayer,
  target?: MaybeRef<HTMLCanvasElement | undefined>
) {
  let canvasRef: MaybeRef<HTMLCanvasElement | undefined> = target
  if (!target) {
    canvasRef = ref<HTMLCanvasElement>()
  } else {
    canvasRef = computed(() => {
      return isRef(target) ? toValue(target) : target
    })
  }

  /** 是否静音 */
  const isMuted = ref(true)

  /** canvas在视口中 */
  const canvasIsVisible = useElementVisibility(canvasRef)

  /** 监听尺寸变化，更新canvas width/height */
  const { stop: stopResizeObserver } = useResizeObserver(canvasRef, (entries) => {
    if (!canvasRef.value || !previewWsUrl.value) {
      return
    }
    const [entry] = entries
    const { width, height } = entry.contentRect
    canvasRef.value.width = width
    canvasRef.value.height = height
  })

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
      if (!wsVideoPlayerIns.isCanvasExist(canvasRef.value)) {
        wsVideoPlayerIns.addCanvas(canvasRef.value, previewWsUrl.value)
        // 更新是否静音
        isMuted.value = wsVideoPlayer.getOneMutedState(previewWsUrl.value)
      }
    } else {
      if (wsVideoPlayerIns.isCanvasExist(canvasRef.value)) {
        wsVideoPlayerIns.removeCanvas(canvasRef.value)
        isMuted.value = true
      }
    }
  })

  /** 播放当前音乐，静音其他音乐 */
  function playAudio() {
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

  watch(
    () => isMuted,
    (val) => console.log('watch isMuted', val)
  )

  const refresh = () => {
    wsVideoPlayer.refresh(previewWsUrl.value)
  }

  return {
    canvasRef,
    isMuted,
    playAudio,
    setAudioMutedState,
    refresh
  }
}
