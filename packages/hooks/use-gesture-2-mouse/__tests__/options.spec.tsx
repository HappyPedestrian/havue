import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Gesture2Mouse from './Gesture2Mouse.vue'

async function sleep(time) {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}

describe.sequential('useGestrue2Mouse normal', async () => {
  const wrapper = mount(Gesture2Mouse, {
    attachTo: document.body
  })

  await nextTick()

  const box2 = wrapper.find('.box2')

  it('create', () => {
    expect(box2.exists()).toBeTruthy()
  })

  it('targetRealSize', async () => {
    await box2.trigger('mousedown', { clientX: 50, clientY: 150, buttons: 1 })

    let emits = wrapper.emitted()
    expect(emits['click']).toHaveLength(1)
    expect(emits['click'][0]).toEqual([{ elX: 50, elY: 50, x: 500, y: 250 }, 'left'])

    const mouseup = new MouseEvent('mouseup', {
      screenX: 60,
      screenY: 160,
      clientX: 60,
      clientY: 160
    })

    document.body.dispatchEvent(mouseup)
    await nextTick()

    emits = wrapper.emitted()
    expect(emits['click']).toHaveLength(2)
    expect(emits['click'][1]).toEqual([{ elX: 60, elY: 60, x: 600, y: 300 }, undefined])
  })

  it('throttle', async () => {
    await sleep(100)
    await box2.trigger('mousedown', { clientX: 50, clientY: 150, buttons: 1 })
    let emits = wrapper.emitted()

    expect(emits['click']).toHaveLength(3)
    expect(emits['click'][2]).toEqual([{ elX: 50, elY: 50, x: 500, y: 250 }, 'left'])

    const mousemove = new MouseEvent('mousemove', {
      screenX: 60,
      screenY: 160,
      clientX: 60,
      clientY: 160,
      buttons: 1
    })

    document.body.dispatchEvent(mousemove)
    await nextTick()

    emits = wrapper.emitted()
    expect(emits['click']).toHaveLength(3)
    expect(emits['click'][2]).toEqual([{ elX: 50, elY: 50, x: 500, y: 250 }, 'left'])

    const mousemove2 = new MouseEvent('mousemove', {
      screenX: 70,
      screenY: 170,
      clientX: 70,
      clientY: 170,
      buttons: 1
    })

    document.body.dispatchEvent(mousemove2)
    await nextTick()
    await sleep(50)

    emits = wrapper.emitted()
    expect(emits['click']).toHaveLength(4)
    expect(emits['click'][3]).toEqual([{ elX: 70, elY: 70, x: 700, y: 350 }, 'left'])

    const mouseup2 = new MouseEvent('mouseup', {
      screenX: 70,
      screenY: 170,
      clientX: 70,
      clientY: 170
    })

    document.body.dispatchEvent(mouseup2)
    await nextTick()

    emits = wrapper.emitted()
    expect(emits['click']).toHaveLength(5)
    expect(emits['click'][4]).toEqual([{ elX: 70, elY: 70, x: 700, y: 350 }, undefined])
  })
})
