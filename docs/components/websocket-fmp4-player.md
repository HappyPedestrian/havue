# 播放使用WebSocket传输的fmp4视频流

实现原理

1. 接收WebSocket传入的数据。
2. 创建MediaSouce实例。
3. 创建SourceBuffer实例。
4. 将数据传递给SourceBuffer实例。
5. 将MediaSouce实例传递给video标签使用。
6. 将video绘制到canvas上。

## 使用

引入useVideoPlay

```ts
import { useVideoPlay } from '@/utils/wsVideoManager/hooks/useVideoPlay'
```

## 函数声明

```ts
import type { Ref, MaybeRef } from 'vue'
import type { WsVideoManager } from '../manager'
import wsVideoPlayer from '../index'

export type CanvasResizeOption = {
  /** 是否启用自动更新canvas width 和 height属性，默认为true */
  enable?: boolean
  /** 设置canvas width 和 height时，
   * 缩放的比例，即元素实际尺寸乘以scale，
   * 放大是为了画面更清晰
   * 默认 1
   */
  scale: number
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
}

// canvasResize 默认值
export const DEFAULT_RESIZE_OPTIONS = Object.freeze({
  enable: true,
  scale: 1,
  maxWidth: 1920,
  maxHeight: 1080
})

type ReturnType {
  /** canvas引用 */
  canvasRef: Ref<HTMLCanvasElement | undefined>
  /** 是否静音 */
  isMuted: Ref<boolean>
  /** 是否暂停 */
  isPaused: Ref<boolean>
  /** 已经连接的WebSocket地址列表 */
  linkedWsUrlList: Ref<string[]>
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
export function useVideoPlay(options: ParamsOptions) : ReturnType {}
```

:::tip
如果canvas显示不清晰，建议设置options.canvasResize, 增大canvas width和height的值，
如增大为window.devicePixelRatio：

```ts
{
  enable: true,
  scale: window.devicePixelRatio || 1,
}
```

:::

## 示例

<script setup lang="ts">
import Demo from '@/components/VideoPlayer/Demo.vue'
</script>

<Demo></Demo>

::: details 点我看代码
::: code-group

<<< ../../src/components/VideoPlayer/Demo.vue#template{vue:line-numbers} [template]

<<< ../../src/components/VideoPlayer/Demo.vue#script{ts:line-numbers} [script]

<<< ../../src/components/VideoPlayer/Demo.vue#style{scss:line-numbers} [style]
:::

## 函数参数

|       参数名          |        说明         |      类型      |    默认值     |
| :------------------- | :------------------ | :-------------| :----------- |
| wsUrl                | WebSocket地址        | `string`        |   —   |
| isReady              | 是否播放             | `boolean \| Ref<boolean>`     |   —   |
| wsVideoPlayerIns     | WsVideoManager实例   | `WsVideoManager`     |   `WsVideoManager()`  |
| target               |    canvas元素, 不传会自动生成一个ref供外部使用  | `HTMLCanvasElement \| Ref<HTMLCanvasElement>`     |   —   |
| autoResizeCanvas     | 是否自动监听canvas尺寸更改，更新canvas width和height             |  `boolean \| Ref<boolean>`     |   `false`   |
