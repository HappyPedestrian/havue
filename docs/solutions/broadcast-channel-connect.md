# 使用BroadcastChannel建立较为可靠的连接

基于BroadcastChannel，建立一个相对可靠，动态更新存在的tab标签页，多个标签页之间选举出主节点。
实现流程如下：

1. 标签页面打开，连接BroadcastChannel时，先广播消息（id为当前时间+随机数）。
2. 已经存在的标签页面广播通道收到广播消息，进行回复。
3. 收到回复后，将该标签页添加到id列表（`friendChannelIdSet`）中。
4. 一定时间（300m）后，根据收到的最新的id列表（`friendChannelIdSet`），可以知道都有那些标签页。
5. 根据id列表信息（`friendChannelIdSet`），可以知道自己是否可以为主节点。
6. 如果是主节点，定时发送主节点心跳广播信息。
7. 所有监听此广播通道的标签页，收到主节点心跳广播信息后，也会广播一次主节点心跳广播信息的回复信息，并将id列表信息保存为旧节点信息列表（`_oldFrendChannelIdList`），清空id列表信息（`friendChannelIdSet`）。
8. 此时根据旧节点信息列表，可以知道自己是否应该是主节点。
9. 所有监听此广播通道的标签页，收到主节点广播信息的回复信息后，将其对应id添加到id列表信息中（`friendChannelIdSet`）。
10. 其他监听此广播通道的非主节点标签页，每次收到主节点心跳广播信息，会设置一个超时时间，如果超时了没收到主节点信息，则认为主节点不在了，然后广播申请为主节点，一定时间内，如果收到其他标签页的拒绝信息，则不成为主节点，如果没收到拒绝信息，则成为主节点。
11. 其他收到申请为主节点的消息后，根据自己的id，回复其是否可以为主节点。

## 示例

可打开多个当前标签页，进行通信

<script setup lang="ts">
import Demo from '@/solutions/broadcast-channel-connect/Demo.vue'
</script>

<Demo></Demo>

::: details 点我看代码
::: code-group

<<< ../../src/solutions/broadcast-channel-connect/Demo.vue#template{vue:line-numbers} [template]

<<< ../../src/solutions/broadcast-channel-connect/Demo.vue#script{ts:line-numbers} [script]

<<< ../../src/solutions/broadcast-channel-connect/Demo.vue#style{scss:line-numbers} [style]
:::

::: details 源码
::: code-group
<<< ../../src/solutions/broadcast-channel-connect/manager.ts{ts:line-numbers} [manager.ts]
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

```ts

// 事件类型
export enum EventTypeEnum {
  /** 初始广播 */
  Broadcast = 'Hello world',
  /** 回复初始广播 */
  Broadcast_Reply = 'I can hear you',
  /** 主节点心跳 */
  Main_Node_Hearbeat = '苍天还在，别立黄天',
  /** 回复主节点心跳 */
  Res_Main_Node_Hearbeat = '苍天在上，受我一拜',
  /** 长时间未收到主节点心跳，我想当主节点，你们同意吗 */
  Req_Be_Main_Node = '苍天已死，黄天当立',
  /** 排资论辈，我应是主节点，不同意 */
  Res_Be_Main_Node = '我是黄天，尔等退下',
  /** 当前BC节点类型更改 */
  Node_Type_Change = 'node type change',
  /** 其他标签页BC节点id列表更新 */
  Friend_List_Update = 'friend list update'
}

type SendMessageType = {
  /** 事件类型 */
  type: string
  /** 数据 */
  data: any
  /** 发送事件的实例id */
  id: number
  /** 消息是发送给目标实例id的 */
  targetId?: number
}
```
