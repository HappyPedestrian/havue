# Play fmp4 Video Stream over WebSocket

For all installation solutions, refer to [Solutions Installation](./index.md)

## Implementation Principle

1. Receive data from WebSocket
2. Create MediaSource instance
3. Create SourceBuffer instance
4. Pass data to SourceBuffer instance
5. Pass MediaSource instance to video tag
6. Draw video to canvas

## Install as Standalone Hooks

If using via hooks, execute the following installation:

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

:::

## Install as Standalone JavaScript Class

If not using hooks:

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

:::

## Usage

Import useVideoPlay hook

```ts
import { useWsVideo } from 'havue'
// or
import { useWsVideo } from '@havue/hooks'
// or
import { useWsVideo } from '@havue/use-ws-video'
```

Import JavaScript manager class

```ts
import { WsVideoManager } from 'havue'
// or
import { WsVideoManager } from '@havue/solutions'
// or
import { WsVideoManager } from '@havue/ws-video-manager'
```

## Function Declaration

<<< ../../../packages/hooks/use-ws-video/src/index.ts#typeimport{ts:line-numbers}

<<< ../../../packages/hooks/use-ws-video/src/index.ts#typedefine{ts:line-numbers}

```ts
/**
 * WebSocket video stream playback
 * @param {UseWsVideoParamsOptions } options Configuration options
 * @returns 
 */
export function useVideoPlay(options: UseWsVideoParamsOptions ) : UseWsVideoReturnType
```

:::tip
If canvas appears blurry, recommend setting options.canvasResize to increase canvas width/height values,
e.g. scale by window.devicePixelRatio

```ts
useVideoPlay({
  canvasResize: {
    enable: true,
    scale: window.devicePixelRatio || 1,
  }
})
```

:::

## Example

<script setup lang="ts">
import Demo from '@/solutions/use-ws-video/index.vue'
</script>

<Demo></Demo>

::: details Click to view code
::: code-group

<<< ../../../demos/solutions/use-ws-video/index.vue#template{vue:line-numbers} [template]

<<< ../../../demos/solutions/use-ws-video/index.vue#script{ts:line-numbers} [script]

<<< ../../../demos/solutions/use-ws-video/index.vue#style{scss:line-numbers} [style]
:::

## useWsVideo Configuration Options

| Parameter          | Description                  | Type                       | Default |
| :----------------- | :--------------------------- | :------------------------- | :------ |
| wsUrl              | WebSocket URL                | `string`                   | -       |
| isReady            | Whether to play              | `boolean \| Ref<boolean>`  | -       |
| wsVideoPlayerIns   | WsVideoManager instance      | `WsVideoManager`           | `WsVideoManager()` |
| target             | Canvas element (auto creates ref if not provided) | `HTMLCanvasElement \| Ref<HTMLCanvasElement>` | - |
| autoResizeCanvas   | Auto-resize canvas dimensions | `CanvasResizeOption \| Ref<CanvasResizeOption>` | `false` |
| closeOnHidden      | Disconnect when element not visible | `boolean`          | `true`  |
| renderOptions      | Render class configuration   | `Partial<RenderConstructorOptionType> \| undefined` | `undefined` |

## WsVideoManager

## Constructor

::: details Click to view code
::: code-group

<<< ../../../packages/solutions/ws-video-manager/src/loader/websocket-loader.ts#typedefine{ts:line-numbers} [loader]

<<< ../../../packages/solutions/ws-video-manager/src/render/index.ts#typedefine{ts:line-numbers} [render]

:::

<<< ../../../packages/solutions/ws-video-manager/src/manager/index.ts#typeimport{ts:line-numbers}
<<< ../../../packages/solutions/ws-video-manager/src/manager/index.ts#typedefine{ts:line-numbers=3}

```ts
export class WsVideoManager extends EventBus<Events> {
  constructor(options?: WsVideoManaCstorOptionType): void
}
```

### Instance Properties

| Property               | Description                          | Type       |
| :--------------------- | :----------------------------------- | :--------- |
| linkedUrlList          | Connected WebSocket URLs            | `string[]` |
| connectLimit           | Max allowed WebSocket connections    | `number`   |
| addCanvas              | Add WebSocket URL and canvas         | `(canvas: HTMLCanvasElement, url: string, renderOptions?: Partial<RenderConstructorOptionType>) => void` |
| removeCanvas           | Remove canvas                        | `(canvas: HTMLCanvasElement) => void` |
| isCanvasExist          | Check canvas existence               | `(canvas: HTMLCanvasElement) => boolean` |
| updateRenderOptions    | Update render configuration          | `(url: string, options?: Partial<RenderConstructorOptionType>) => void` |
| setAllVideoMutedState  | Set mute state for all videos        | `(muted: boolean) => void` |
| setOneMutedState       | Set mute state for single video      | `(url: string, muted: boolean) => void` |
| getOneMutedState       | Get mute state for single video      | `(url: string) => void` |
| playOneAudio           | Play audio from single video only    | `(url: string) => void` |
| setAllVideoPausedState | Set pause state for all videos       | `(paused: boolean) => void` |
| setOneVideoPausedState | Set pause state for single video     | `(url: string, paused: boolean) => void` |
| getOneVideoPausedState | Get pause state for single video     | `(url: string) => void` |
| playOneVideo           | Play single video only               | `(url: string) => void` |
| refresh                | Refresh video playback (reconnect if needed) | `(url?: string) => void` |
| on                     | Event listener                       | `(event: string, cb: (...args) => void) => void` |
| off                    | Remove event listener                | `(event: string, cb?: (...args) => void) => void` |
| emit                   | Trigger event                        | `(event: string, ...args) => void` |
| destroy                | Destroy instance                     | `() => void` |

### Events

| Event                 | Description                          | Type       |
| :-------------------- | :----------------------------------- | :--------- |
| `wsUrlChange`         | WebSocket URL list updated          | `(urls: string[]) => void` |
| `audioStateChange`    | Audio mute state changed            | `(url: string, state: AudioState) => void` |
| `videoStateChange`    | Video playback state changed        | `(url: string, state: VideoState) => void` |
| `videoInfoUpdate`     | Video dimension info updated        | `(url: string, state: VideoInfo) => void` |
| `socketClose`         | WebSocket connection closed         | `(url: string) => void` |
| `connectLimit`        | Exceeded connection limit           | `() => void` |

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
