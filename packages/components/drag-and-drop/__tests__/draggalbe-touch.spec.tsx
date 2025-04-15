import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { HvDraggable } from '@havue/drag-and-drop'
import { nextTick } from 'vue'

async function sleep(time) {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}

describe.sequential('HvDraggable touch', () => {
  test('immediate all', async () => {
    const wrapper = mount(HvDraggable, {
      props: {
        type: 'test',
        immediate: 'all'
      },
      attrs: {
        style: 'width: 100px; height: 100px;'
      },
      attachTo: document.body
    })
    await nextTick()

    const touchstart = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 10, clientY: 10, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchstart)
    await nextTick()

    const touchmove = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchmove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeTruthy()
    expect(cloneItem.element.getAttribute('style')).toBe('transform: translate(50px, 50px) translate(-50%, -50%);')

    const touchend = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(touchend)
    wrapper.unmount()
  })

  test('normal drag(300ms)', async () => {
    const wrapper = mount(HvDraggable, {
      props: {
        type: 'test'
      },
      attrs: {
        style: 'width: 100px; height: 100px;'
      },
      attachTo: document.body
    })
    await nextTick()

    const touchstart = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 10, clientY: 10, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchstart)
    await sleep(400)

    const touchmove = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchmove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeTruthy()
    expect(cloneItem.element.getAttribute('style')).toBe('transform: translate(50px, 50px) translate(-50%, -50%);')

    const touchend = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(touchend)
    wrapper.unmount()
  })

  test('immediate drag-left', async () => {
    const wrapper = mount(HvDraggable, {
      props: {
        type: 'test',
        immediate: 'left'
      },
      attrs: {
        style: 'width: 100px; height: 100px;'
      },
      attachTo: document.body
    })
    await nextTick()

    // move to right
    const touchstart = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 10, clientY: 10, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchstart)
    await nextTick()

    const touchmove = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchmove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeFalsy()

    const touchend = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(touchend)
    await nextTick()

    // move to left
    const touchstart2 = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchstart2)
    await nextTick()

    const mousemove2 = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 10, clientY: 10, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(mousemove2)
    await nextTick()

    const cloneItem2 = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem2.exists()).toBeTruthy()
    expect(cloneItem2.element.getAttribute('style')).toBe('transform: translate(10px, 10px) translate(-50%, -50%);')

    const mouseup2 = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(mouseup2)
    wrapper.unmount()
  })

  test('immediate drag-right', async () => {
    const wrapper = mount(HvDraggable, {
      props: {
        type: 'test',
        immediate: 'right'
      },
      attrs: {
        style: 'width: 100px; height: 100px;'
      },
      attachTo: document.body
    })
    await nextTick()

    // move to right
    const touchstart = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchstart)
    await nextTick()

    const touchmove = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 10, clientY: 10, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchmove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeFalsy()

    const touchend = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(touchend)
    await nextTick()

    // move to left
    const touchstart2 = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 10, clientY: 10, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchstart2)
    await nextTick()

    const mousemove2 = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(mousemove2)
    await nextTick()

    const cloneItem2 = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem2.exists()).toBeTruthy()
    expect(cloneItem2.element.getAttribute('style')).toBe('transform: translate(50px, 50px) translate(-50%, -50%);')

    const mouseup2 = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(mouseup2)
    wrapper.unmount()
  })

  test('immediate drag-top', async () => {
    const wrapper = mount(HvDraggable, {
      props: {
        type: 'test',
        immediate: 'top'
      },
      attrs: {
        style: 'width: 100px; height: 100px;'
      },
      attachTo: document.body
    })
    await nextTick()

    // move to right
    const touchstart = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 10, clientY: 10, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchstart)
    await nextTick()

    const touchmove = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchmove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeFalsy()

    const touchend = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(touchend)
    await nextTick()

    // move to left
    const touchstart2 = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchstart2)
    await nextTick()

    const mousemove2 = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 10, clientY: 10, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(mousemove2)
    await nextTick()

    const cloneItem2 = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem2.exists()).toBeTruthy()
    expect(cloneItem2.element.getAttribute('style')).toBe('transform: translate(10px, 10px) translate(-50%, -50%);')

    const mouseup2 = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(mouseup2)
    wrapper.unmount()
  })

  test('immediate drag-bottom', async () => {
    const wrapper = mount(HvDraggable, {
      props: {
        type: 'test',
        immediate: 'bottom'
      },
      attrs: {
        style: 'width: 100px; height: 100px;'
      },
      attachTo: document.body
    })
    await nextTick()

    // move to right
    const touchstart = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchstart)
    await nextTick()

    const touchmove = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 10, clientY: 10, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchmove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeFalsy()

    const touchend = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(touchend)
    await nextTick()

    // move to left
    const touchstart2 = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 10, clientY: 10, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(touchstart2)
    await nextTick()

    const mousemove2 = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: wrapper.element })]
    })
    document.body.dispatchEvent(mousemove2)
    await nextTick()

    const cloneItem2 = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem2.exists()).toBeTruthy()
    expect(cloneItem2.element.getAttribute('style')).toBe('transform: translate(50px, 50px) translate(-50%, -50%);')

    const mouseup2 = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(mouseup2)
    wrapper.unmount()
  })
})
