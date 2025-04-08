# Establishing Reliable Connections Using BroadcastChannel

To install all solutions, refer to [Solutions Installation](./index.md)

Using BroadcastChannel, different tabs from the same origin can communicate with each other. Some operations need to be executed in one tab and broadcast to others.

Example use case:
When establishing a WebSocket connection with a server, only one tab should maintain the communication. This requires coordination between multiple tabs to elect a master tab for connection establishment and message broadcasting.

This solution uses BroadcastChannel to implement:

- A relatively reliable system
- Dynamic updates of tab lists
- Master node election
- Event monitoring

## Implementation Workflow

1. ​**Tab Initialization**: When a tab opens and connects to BroadcastChannel, it first broadcasts a message (with ID generated as current timestamp + random number).
2. ​**Existing Tab Response**: Existing tabs receive the broadcast and reply.
3. ​**ID Collection**: Upon receiving responses, add sender IDs to the ID list (`friendChannelIdSet`).
4. ​**List Finalization**: After 300ms, finalize the ID list (`friendChannelIdSet`) to determine existing tabs.
5. ​**Master Election**: Each tab determines if it can become the master node based on the ID list.
6. ​**Master Responsibilities**:
   - Send regular heartbeat broadcasts
   - Save ID list as `_oldFrendChannelIdList`
   - Clear current ID list (`friendChannelIdSet`)
   - Re-evaluate master status based on old list; step down if necessary
7. ​**Heartbeat Handling**: Tabs receiving master heartbeats will:
   - Reply to heartbeat
   - Save master's ID list as `_oldFrendChannelIdList`
   - Clear current ID list
   - Add master node to ID list
8. ​**Response Processing**: Tabs add received IDs to their `friendChannelIdSet`.
9. ​**Master Election Request**: Non-master tabs set a timeout after receiving heartbeats. If timeout occurs:
   - Broadcast master election request
   - Become master if no rejections received within timeframe
10. ​**Election Responses**: Tabs receiving election requests reply with rejection/acceptance based on their own ID priority.

## Installation

::: code-group

```shell [npm]
npm install @havue/bc-connect --save
```

```shell [yarn]
yarn add @havue/bc-connect
```

```shell [pnpm]
pnpm install @havue/bc-connect
```

:::

## Usage

Import:

```ts
import { BroadcastChannelManager } from 'havue'
// or
import { BroadcastChannelManager } from '@havue/solutions'
// or
import { BroadcastChannelManager } from '@havue/bc-connect'
```

## Examples

Try copying this page's URL and opening it in multiple tabs to observe communication.

<script setup lang="ts">
import Demo from '@/solutions/bc-connect/index.vue'
</script>

<Demo></Demo>

::: details Click to view code
::: code-group

<<< ../../../demos/solutions/bc-connect/index.vue#template{vue:line-numbers} [template]

<<< ../../../demos/solutions/bc-connect/index.vue#script{ts:line-numbers} [script]

<<< ../../../demos/solutions/bc-connect/index.vue#style{scss:line-numbers} [style]
:::

::: details Source Code
::: code-group
<<< ../../../packages/solutions/bc-connect/src/manager.ts{ts:line-numbers} [manager.ts]
:::

## BroadcastChannelManager Class Reference

### Constructor

|   Property     |        Description          |            Parameter Type                |
| :-------  | :------------------ | :-------------------------------   |
| constructor  | Creates instance with channel name    | `(name: string) => void`              |

### Instance Properties

|   Property     |        Description          |            Type             |
| :-------  | :------------------ | :-------------------------------   |
| id        | Unique instance ID                | `number`                         |
| nodeType  | Current node type           | `NodeTypeEnum \| null`           |
| friendList  | List of other tab IDs    | `number[]`           |
| connect   | Establish channel connection    | `() => void`                   |
| close     | Close connection    | `() => void`                |
| destroy   | Destroy instance              | `() => void`                      |
| send      | Broadcast message to all    | `(type: string, data?:any) => void`        |
| sendToTarget  | Send message to specific ID    | `(type: string, targetId: number, data?:any) => void`        |
| on        | Listen for events        | `(event: string, callback: (_: SendMessageType) => void) => void`        |
| off       | Remove event listener    | `(event: string, callback?: (_: SendMessageType) => void) => void`        |
| emit      | Trigger event          | `(event: string, data: SendMessageType) => void`        |

### Type Definitions

<<< ../../../packages/solutions/bc-connect/src/manager.ts#typedefine{ts:line-numbers}
