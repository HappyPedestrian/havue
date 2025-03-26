# 使用BroadcastChannel建立较为可靠的连接

如需安装所有解决方案，请参考[安装](./index.md)

使用BroadcastChannel，同源的不同标签页之间可以相互通信，有的时候，一些操作需要在一个标签页面执行，然后广播给其他标签页。

比如：
和服务器建立WebSocket通信，只能一个标签页和服务器建立通信，这个时候就需要多个标签页之间协调出一个主标签页建立连接，将消息广播给其他标签页。

此方案基于BroadcastChannel，建立一个相对可靠，动态更新其他tab标签页列表，多个标签页之间选举出主节点，以及监听相关事件。

## 实现流程如下

1. 标签页面打开，连接BroadcastChannel时，先广播消息（id为当前时间+随机数）。
2. 已经存在的标签页面广播通道收到广播消息，进行回复。
3. 收到回复后，将该标签页添加到id列表（`friendChannelIdSet`）中。
4. 一定时间（300ms）后，根据收到的最新的id列表（`friendChannelIdSet`），可以知道都有那些标签页。
5. 根据id列表信息（`friendChannelIdSet`），可以知道自己是否可以为主节点。
6. 如果是主节点，定时发送主节点心跳广播信息，并将id列表信息保存为旧节点信息列表（`_oldFrendChannelIdList`），清空id列表信息（`friendChannelIdSet`）。
7. 此时主节点根据旧节点信息列表，可以知道自己是否应该是主节点，如果不应该是，则自动变为普通节点。
8. 所有监听此广播通道的标签页，收到主节点心跳广播信息后，也会广播一次主节点心跳广播信息的回复信息，并将id列表信息保存为旧节点信息列表（`_oldFrendChannelIdList`），清空id列表信息（`friendChannelIdSet`），将主节点添加到id列表中。
9. 所有监听此广播通道的标签页，收到主节点广播信息的回复信息后，将其对应id添加到id列表信息中（`friendChannelIdSet`）。
10. 其他监听此广播通道的非主节点标签页，每次收到主节点心跳广播信息，会设置一个超时时间，如果超时了没收到主节点信息，则认为主节点不在了，然后广播申请为主节点，一定时间内，如果收到其他标签页的拒绝信息，则不成为主节点，如果没收到拒绝信息，则成为主节点。
11. 其他收到申请为主节点的消息后，根据自己的id，回复其是否可以为主节点。

## 单独安装此javascript类

::: code-group

```shell [npm]
npm install @pedy/bc-connect --save
```

```shell [yarn]
yarn add @pedy/bc-connect
```

```shell [pnpm]
pnpm install @pedy/bc-connect
```

## 使用

引入

```ts
import { BroadcastChannelManager } from 'pedy'
// or
import { BroadcastChannelManager } from '@pedy/solutions'
```

## 示例

可复制当前页面地址，通过其他标签页打开，进行通信。

<script setup lang="ts">
import Demo from '@/solutions/bc-connect/index.vue'
</script>

<Demo></Demo>

::: details 点我看代码
::: code-group

<<< ../../demos/solutions/bc-connect/index.vue#template{vue:line-numbers} [template]

<<< ../../demos/solutions/bc-connect/index.vue#script{ts:line-numbers} [script]

<<< ../../demos/solutions/bc-connect/index.vue#style{scss:line-numbers} [style]
:::

::: details 源码
::: code-group
<<< ../../packages/solutions/bc-connect/src/manager.ts{ts:line-numbers} [manager.ts]
:::

## BroadcastChannelManager类介绍

### 构造函数

|   属性     |        说明          |            参数类型                |
| :-------  | :------------------ | :-------------------------------   |
| constructor  | 构造函数, 参数为通道名称    | `(name: string) => void`              |

### 实例属性

|   属性     |        说明          |            (参数)类型             |
| :-------  | :------------------ | :-------------------------------   |
| id        | 实例id                | `number`                         |
| nodeType  | 当前节点类型           | `NodeTypeEnum \| null`           |
| friendList  | 存储的其他标签页通道实例id列表    | `number[]`           |
| connect   | 建立通信，监听通道消息    | `() => void`                   |
| close     | 断开通信，不再监听通道消息    | `() => void`                |
| destroy   | 销毁实例              | `() => void`                      |
| send      | 广播消息,其他实例会触发`type`事件    | `(type: string, data?:any) => void`        |
| sendToTarget  | 给特定id的实例广播消息    | `(type: string, targetId: number, data?:any) => void`        |
| on        | 监听特定事件        | `(event: string, callback: (_: SendMessageType) => void) => void`        |
| off       | 取消监听事件, 不传`callback`会清空事件    | `(event: string, callback?: (_: SendMessageType) => void) => void`        |
| emit      | 触发事件          | `(event: string, data: SendMessageType) => void`        |

### 类型定义

<<< ../../packages/solutions/bc-connect/src/manager.ts#typedefine{ts:line-numbers}
