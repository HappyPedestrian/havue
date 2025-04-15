import { describe, expect, it } from 'vitest'
import { BroadcastChannelManager, BcConnectNodeTypeEnum } from '@havue/bc-connect'

async function sleep(time) {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}

const DEBUG = false

describe.sequential('BroadcastChannelManager', () => {
  it('should create a new instance', () => {
    const manager = new BroadcastChannelManager('test-channel', DEBUG)
    expect(manager).toBeInstanceOf(BroadcastChannelManager)
    manager.destroy()
  })

  it('should be Main', async () => {
    const manager = new BroadcastChannelManager('test-channel', DEBUG)
    manager.connect()
    expect(manager.nodeType).toBeUndefined()
    await sleep(400)
    expect(manager.nodeType).toBe(BcConnectNodeTypeEnum.Main)
    manager.close()
    manager.destroy()
  })

  it('when channel closed', async () => {
    const manager = new BroadcastChannelManager('test-channel', DEBUG)
    manager.connect()
    manager.close()
    await sleep(400)
    expect(manager.nodeType).toBeUndefined()
    manager.destroy()
  })

  it('should handle messages', async () => {
    const manager1 = new BroadcastChannelManager('test-channel', DEBUG)
    // 确保第二个id生成在第一个之后
    await sleep(10)
    const manager2 = new BroadcastChannelManager('test-channel', DEBUG)
    manager1.connect()
    manager2.connect()
    await sleep(1200)

    const message1 = { type: 'test', data: 'Hello, manger2!' }
    const message2 = { type: 'test', data: 'Hello, manger1!' }

    manager1.on('test', (message) => {
      expect(message.data).toBe(message2.data)
    })
    manager2.on('test', (message) => {
      expect(message.data).toBe(message1.data)
    })

    manager1.send(message1.type, message1.data)
    manager2.send(message2.type, message2.data)
    expect(manager1.nodeType).toBe(BcConnectNodeTypeEnum.Main)
    expect(manager2.nodeType).toBe(BcConnectNodeTypeEnum.Normal)

    expect(manager1.friendList).toContain(manager2.id)
    expect(manager2.friendList).toContain(manager1.id)

    // wait for the message to be received
    await sleep(1000)
    manager1.close()
    manager2.close()

    manager1.destroy()
    manager2.destroy()
  })
})
