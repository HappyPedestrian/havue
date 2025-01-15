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
  /** 视口中元素不可见时断开连接， 默认为true */
  closeOnHidden?: MaybeRef<boolean>
  /** 自定义Render配置 */
  renderOptions?: MaybeRef<Partial<RenderConstructorOptionType>>
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
  /** 刷新当前WebSocket视频流的时间，如果连接断开会进行重连 */
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
如增大为window.devicePixelRatio

```ts
useVideoPlay({
  canvasResize: {
    enable: true,
    scale: window.devicePixelRatio || 1,
  }
})
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

## useVideoPlay函数配置对象介绍

|       参数名          |        说明         |      类型      |    默认值     |
| :------------------- | :------------------ | :-------------| :----------- |
| wsUrl                | WebSocket地址        | `string`        |   —   |
| isReady              | 是否播放             | `boolean \| Ref<boolean>`     |   —   |
| wsVideoPlayerIns     | WsVideoManager实例   | `WsVideoManager`     |   `WsVideoManager()`  |
| target               |    canvas元素, 不传会自动生成一个ref供外部使用  | `HTMLCanvasElement \| Ref<HTMLCanvasElement>`     |   —   |
| autoResizeCanvas     | 是否自动监听canvas尺寸更改，更新canvas width和height | `CanvasResizeOption \| Ref<CanvasResizeOption>` | `false` |
| closeOnHidden        | 视口中元素不可见时断开连接 | `boolean`  | `true` |
| renderOptions        | Render类实例配置 | `Partial<RenderConstructorOptionType> \| undefined`  | `undefined` |

## WsVideoManager

## WsVideoManager构造函数

```ts
/** 心跳配置 */
type HeartbeatConfigType = {
  /** 只发送一次 */
  once: boolean
  /** 心跳消息 */
  message: string
  /** 时间间隔 */
  interval?: number
}

/** 重连配置 */
type InterruptConfigType = {
  /** 是否重连 */
  reconnect: boolean
  /** 最大重连次数 */
  maxReconnectTimes: number
  /** 每次重连延时 */
  delay: number
}

type WebSocketOptionsType = {
  /** WebSocket 子协议 WebSocket(url: string, protocols: string | string[]) */
  protocols?: string | string[]
  /** WebSocket 连接所传输二进制数据的类型 */
  binaryType?: WebSocket['binaryType']
  heartbeat?: HeartbeatConfigType
  interrupt?: InterruptConfigType
}

export type RenderConstructorOptionType = {
  /** 当前播放currentTime和最新视频时长最多相差 秒数，
   * 默认0.3s，
   * 可更加实际流每次传递的时长情况进行调整，
   * 设置太小可能会导致卡顿 
   */
  liveMaxLatency: number
  /** 最多缓存ws传输的未处理的buffer数据大小, 
   * 默认200kb
   */
  maxCacheBufByte: number
  /** 最多存储的时间，
   * 用于清除在currentTime之前x秒时间节点前的buffer数据, 
   * 默认10s 
   */
  maxCache: number
}

export type WsVideoManaCstorOptionType = {
  /** 预监流连接数量限制, 移动端默认10个，pc端默认32个 */
  connectLimit?: number
  /** WebSocketLoader 实例配置 */
  wsOptions?: WebSocketOptionsType
  /** websocket重连时，重新解析视频编码方式 */
  reparseMimeOnReconnect?: boolean
  /** Render 实例配置 */
  renderOptions?: Partial<RenderConstructorOptionType>
}

class WsVideoManager {
  constructor(options?: WsVideoManaCstorOptionType) {}
}
```

### WsVideoManager实例属性

|       参数名           |        说明                   |      类型      |
| :-------------------- | :---------------------------- | :-------------|
| linkedUrlList         | 已连接的websocket地址列表      | `string[]` |
| connectLimit          | 当前实例限制的WebSocket连接数量 | `number`   |
| addCanvas             | 添加WebSocket地址以及需要绘制的cannvas元素  | `(canvas: HTMLCanvasElement, url: string, renderOptions?: Partial<RenderConstructorOptionType>) => void`       |
| removeCanvas          | 移除需要绘制cannvas元素        | `(canvas: HTMLCanvasElement) => void`       |
| isCanvasExist         | 判断canvas是否存在             | `(canvas: HTMLCanvasElement) => boolean`       |
| updateRenderOptions   | 更新render实例配置           | `(url: string, options?: Partial<RenderConstructorOptionType>) => void`|
| setAllVideoMutedState  | 设置所有视频静音状态           | `(muted: boolean) => void`       |
| setOneMutedState      | 设置单个视频静音状态            | `(url: string, muted: boolean) => void`     |
| getOneMutedState      | 获取单个视频静音状态            | `(url: string) => void`       |
| playOneAudio          | 只播放单个视频的音频，其他静音   | `(url: string) => void`       |
| setAllVideoPausedState | 设置所有视频是否暂停播放       | `(paused: boolean) => void`       |
| setOneVideoPausedState | 设置单个视频是否暂停播放       | `(url: string, paused: boolean) => void`    |
| getOneVideoPausedState | 获取单个视频是否暂停播放       | `(url: string) => void`       |
| playOneVideo           | 播放单个视频，其他暂停播放     | `(url: string) => void`       |
| refresh                | 刷新目标视频播放时间，如果连接断开，重新连接，（可不传url,不传刷新所有）       | `(url?: string) => void`       |
| on                    | 监听事件                      | `(event: string, cb: (...args) => void) => void`       |
| off                   | 停止监听事件                  | `(event: string, cb?: (...args) => void) => void`       |
| emit                   | 触发事件                     | `(event: string, ...args) => void`       |
| destroy                | 销毁实例                     | `() => void`    |

### WsVideoManager实例事件

|      事件                                     |        说明       |      类型      |
| :-------------------------------------------- | :--------------- | :-------------|
| `wsUrlChange`      | 已经添加的WebSocket连接地址列表更新 | `(urls: string[]) => void` |
| `audioStateChange` | 视频静音状态更改  | `(url: string, state: AudioState) => void`  |
| `videoStateChange` | 视频播放状态更改  | `(url: string, state: VideoState) => void`  |
| `videoInfoUpdate`  | 视频尺寸信息更新  | `(url: string, state: VideoInfo) => void`  |
| `socketClose`      | WebSocket连接断开  | `(url: string) => void`  |
| `connectLimit`     | WebSocket连接数量超过限制  | `() => void`  |

```ts
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
```
