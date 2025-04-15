import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Gesture2Mouse from './Gesture2Mouse.vue'

describe.sequential('useGestrue2Mouse touch', async () => {
  const wrapper = mount(Gesture2Mouse, {
    attachTo: document.body
  })

  await nextTick()

  const box1 = wrapper.find('.box1')

  it('create', () => {
    expect(box1.exists()).toBeTruthy()
  })

  // it('left', async () => {
  //   await box1.trigger('touchstart', {
  //     touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: box1.element })]
  //   })

  //   let emits = wrapper.emitted()
  //   expect(emits['click']).toBeUndefined()

  //   const touchmove1 = new TouchEvent('touchmove', {
  //     touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: box1.element })]
  //   })

  //   document.body.dispatchEvent(touchmove1)
  //   await nextTick()
  //   expect(emits['click']).toHaveLength(1)
  //   expect(emits['click'][0]).toEqual([{ elX: 50, elY: 50, x: 50, y: 50 }, 'left'])

  //   const touchmove2 = new TouchEvent('touchmove', {
  //     touches: [new Touch({ clientX: 60, clientY: 60, identifier: 1, target: box1.element })]
  //   })

  //   document.body.dispatchEvent(touchmove2)
  //   await nextTick()

  //   emits = wrapper.emitted()
  //   expect(emits['click']).toHaveLength(2)
  //   expect(emits['click'][1]).toEqual([{ elX: 60, elY: 60, x: 60, y: 60 }, 'left'])

  //   const touchend = new TouchEvent('touchend', {
  //     touches: [new Touch({ clientX: 60, clientY: 60, identifier: 1, target: box1.element })]
  //   })

  //   document.body.dispatchEvent(touchend)
  //   await nextTick()

  //   emits = wrapper.emitted()
  //   expect(emits['click']).toHaveLength(4)
  //   expect(emits['click'][2]).toEqual([{ elX: 60, elY: 60, x: 60, y: 60 }, 'left'])
  //   expect(emits['click'][3]).toEqual([{ elX: 60, elY: 60, x: 60, y: 60 }, undefined])
  // })

  // it('right', async () => {
  //   await box1.trigger('touchstart', {
  //     touches: [
  //       new Touch({ clientX: 40, clientY: 40, identifier: 1, target: box1.element }),
  //       new Touch({ clientX: 60, clientY: 60, identifier: 1, target: box1.element })
  //     ]
  //   })

  //   const touchend = new TouchEvent('touchend', {
  //     touches: []
  //   })

  //   document.body.dispatchEvent(touchend)
  //   await nextTick()

  //   const emits = wrapper.emitted()
  //   expect(emits['click']).toHaveLength(6)
  //   expect(emits['click'][4]).toEqual([{ elX: 50, elY: 50, x: 50, y: 50 }, 'right'])
  //   expect(emits['click'][5]).toEqual([{ elX: 50, elY: 50, x: 50, y: 50 }, undefined])
  // })

  it('wheel', async () => {
    const event = new TouchEvent('touchstart', {
      touches: [
        new Touch({ clientX: 60, clientY: 60, identifier: 1, target: box1.element }),
        new Touch({ clientX: 80, clientY: 80, identifier: 1, target: box1.element })
      ]
    })
    box1.element.dispatchEvent(event)
    await nextTick()

    const touchmove1 = new TouchEvent('touchmove', {
      touches: [
        new Touch({ clientX: 60, clientY: 60, identifier: 2, target: box1.element }),
        new Touch({ clientX: 80, clientY: 80, identifier: 2, target: box1.element })
      ]
    })

    document.body.dispatchEvent(touchmove1)
    await nextTick()

    const touchmove2 = new TouchEvent('touchmove', {
      touches: [
        new Touch({ clientX: 60, clientY: 60, identifier: 3, target: box1.element }),
        new Touch({ clientX: 80, clientY: 80, identifier: 3, target: box1.element })
      ]
    })

    document.body.dispatchEvent(touchmove2)
    await nextTick()

    const touchmove3 = new TouchEvent('touchmove', {
      touches: [
        new Touch({ clientX: 60, clientY: 40, identifier: 4, target: box1.element }),
        new Touch({ clientX: 80, clientY: 60, identifier: 4, target: box1.element })
      ]
    })
    document.body.dispatchEvent(touchmove3)
    await nextTick()

    const touchend = new TouchEvent('touchend', {
      touches: []
    })

    document.body.dispatchEvent(touchend)
    await nextTick()

    const emits = wrapper.emitted()

    expect(emits['wheel']).toHaveLength(3)
    expect(emits['wheel'][0]).toEqual([{ elX: 70, elY: 70, x: 70, y: 70 }, 0])
    expect(emits['wheel'][1]).toEqual([{ elX: 70, elY: 70, x: 70, y: 70 }, 0])
    expect(emits['wheel'][2]).toEqual([{ elX: 70, elY: 70, x: 70, y: 70 }, 20])

    wrapper.unmount()
  })
})
