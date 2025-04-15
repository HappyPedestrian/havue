import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Gesture2Mouse from './Gesture2Mouse.vue'

describe.sequential('useGestrue2Mouse mouse', async () => {
  const wrapper = mount(Gesture2Mouse, {
    attachTo: document.body
  })

  await nextTick()

  const box1 = wrapper.find('.box1')

  it('create', () => {
    expect(box1.exists()).toBeTruthy()
  })

  it('left', async () => {
    await box1.trigger('mousedown', { clientX: 50, clientY: 50, buttons: 1 })

    let emits = wrapper.emitted()
    expect(emits['click']).toHaveLength(1)
    expect(emits['click'][0]).toEqual([{ elX: 50, elY: 50, x: 50, y: 50 }, 'left'])

    const mousemove = new MouseEvent('mousemove', {
      screenX: 60,
      screenY: 60,
      clientX: 60,
      clientY: 60,
      buttons: 1
    })

    document.body.dispatchEvent(mousemove)
    await nextTick()

    emits = wrapper.emitted()
    expect(emits['click']).toHaveLength(2)
    expect(emits['click'][1]).toEqual([{ elX: 60, elY: 60, x: 60, y: 60 }, 'left'])

    const mouseup = new MouseEvent('mouseup', {
      screenX: 60,
      screenY: 60,
      clientX: 60,
      clientY: 60
    })

    document.body.dispatchEvent(mouseup)
    await nextTick()

    emits = wrapper.emitted()
    expect(emits['click']).toHaveLength(3)
    expect(emits['click'][2]).toEqual([{ elX: 60, elY: 60, x: 60, y: 60 }, undefined])
  })

  it('right', async () => {
    await box1.trigger('mousedown', { clientX: 50, clientY: 50, buttons: 2 })
    let emits = wrapper.emitted()

    expect(emits['click']).toHaveLength(4)
    expect(emits['click'][3]).toEqual([{ elX: 50, elY: 50, x: 50, y: 50 }, 'right'])

    const mouseup2 = new MouseEvent('mouseup', {
      screenX: 50,
      screenY: 50,
      clientX: 50,
      clientY: 50
    })

    document.body.dispatchEvent(mouseup2)
    await nextTick()

    emits = wrapper.emitted()
    expect(emits['click']).toHaveLength(5)
    expect(emits['click'][4]).toEqual([{ elX: 50, elY: 50, x: 50, y: 50 }, undefined])
  })

  it('middle', async () => {
    await box1.trigger('mousedown', { clientX: 50, clientY: 50, buttons: 4 })
    let emits = wrapper.emitted()

    expect(emits['click']).toHaveLength(6)
    expect(emits['click'][5]).toEqual([{ elX: 50, elY: 50, x: 50, y: 50 }, 'middle'])

    const mouseup2 = new MouseEvent('mouseup', {
      screenX: 50,
      screenY: 50,
      clientX: 50,
      clientY: 50
    })

    document.body.dispatchEvent(mouseup2)
    await nextTick()

    emits = wrapper.emitted()
    expect(emits['click']).toHaveLength(7)
    expect(emits['click'][6]).toEqual([{ elX: 50, elY: 50, x: 50, y: 50 }, undefined])
  })

  it('wheel', async () => {
    const event = new WheelEvent('wheel', {
      deltaY: 100,
      clientX: 70,
      clientY: 70
    })
    box1.element.dispatchEvent(event)
    await nextTick()

    const emits = wrapper.emitted()
    // console.log('emited:', emits)

    expect(emits['wheel']).toHaveLength(1)
    expect(emits['wheel'][0]).toEqual([{ elX: 70, elY: 70, x: 70, y: 70 }, 100])

    wrapper.unmount()
  })
})
