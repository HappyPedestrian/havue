# 播放使用WebSocket传输的fmp4视频流

安装所有解决方案，请参考[安装](./index.md)

实现原理

1. 接收WebSocket传入的数据。
2. 创建MediaSouce实例。
3. 创建SourceBuffer实例。
4. 将数据传递给SourceBuffer实例。
5. 将MediaSouce实例传递给video标签使用。
6. 将video绘制到canvas上。

## 单独安装此hooks

如果通过hook的方式使用，执行以下安装即可

::: code-group

```shell [npm]
npm install @havue/use-ws-video --save
```

```shell [yarn]
yarn add @havue/use-ws-video
```

```shell [pnpm]
pnpm install @havue/use-ws-video
```

## 单独安装此javascript类

如果不通过hook的方式使用：

::: code-group

```shell [npm]
npm install @havue/ws-video-manager --save
```

```shell [yarn]
yarn add @havue/ws-video-manager
```

```shell [pnpm]
pnpm install @havue/ws-video-manager
```

## 使用

引入useVideoPlay hook

```ts
import { useWsVideo } from 'havue'
// or
import { useWsVideo } from '@havue/hooks'
// or
import { useWsVideo } from '@havue/use-ws-video'
```

引入 javascript manager 类使用

```ts
import { WsVideoManager } from 'havue'
// or
import { WsVideoManager } from '@havue/solutions'
// or
import { WsVideoManager } from '@havue/ws-video-manager'
```

## 函数声明

<<< ../../packages/hooks/use-ws-video/src/index.ts#typeimport{ts:line-numbers}

<<< ../../packages/hooks/use-ws-video/src/index.ts#typedefine{ts:line-numbers}

```ts
/**
 * websocket视频流播放
 * @param {UseWsVideoParamsOptions } options 配置项
 * @returns
 */
export function useVideoPlay(options: UseWsVideoParamsOptions ) : UseWsVideoReturnType
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
import Demo from '@/solutions/use-ws-video/index.vue'
</script>

<Demo></Demo>

::: details 点我看代码
::: code-group

<<< ../../demos/solutions/use-ws-video/index.vue#template{vue:line-numbers} [template]

<<< ../../demos/solutions/use-ws-video/index.vue#script{ts:line-numbers} [script]

<<< ../../demos/solutions/use-ws-video/index.vue#style{scss:line-numbers} [style]
:::

## useWsVideo函数配置对象介绍

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

::: details 点我看代码
::: code-group

<<< ../../packages/solutions/ws-video-manager/src/loader/websocket-loader.ts#typedefine{ts:line-numbers} [loader]

<<< ../../packages/solutions/ws-video-manager/src/render/index.ts#typedefine{ts:line-numbers} [render]

:::

<<< ../../packages/solutions/ws-video-manager/src/manager/index.ts#typeimport{ts:line-numbers}
<<< ../../packages/solutions/ws-video-manager/src/manager/index.ts#typedefine{ts:line-numbers=3}

```ts
export class WsVideoManager extends EventBus<Events> {
  constructor(options?: WsVideoManaCstorOptionType): void
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
