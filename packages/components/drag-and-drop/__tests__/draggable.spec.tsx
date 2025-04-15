import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { HvDraggable } from '@havue/drag-and-drop'
import { nextTick } from 'vue'

async function sleep(time) {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}

describe.sequential('HvDraggable mouse', () => {
  test('create', async () => {
    const wrapper = mount(HvDraggable, {
      props: {
        type: 'test'
      }
    })
    expect(wrapper.find('.hv-draggable').exists()).toBeTruthy()
    expect(wrapper.props().type).toBe('test')
    expect(wrapper.props().immediate).toBeUndefined()
    expect(wrapper.props().disabled).toBe(false)
    expect(wrapper.props().data).toBeUndefined()
    wrapper.unmount()
  })

  test('disabled', async () => {
    const wrapper = mount(HvDraggable, {
      props: {
        type: 'test',
        immediate: 'all',
        disabled: true
      }
    })
    await nextTick()
    expect(wrapper.find('.hv-draggable.disabled').exists()).toBeTruthy()

    const mousedown = new MouseEvent('mousedown', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown)
    await nextTick()

    const mousemove = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeFalsy()

    const mouseup = new MouseEvent('mouseup', {
      clientX: 50,
      clientY: 50
    })
    document.body.dispatchEvent(mouseup)
    wrapper.unmount()
  })

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

    const mousedown = new MouseEvent('mousedown', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown)
    await nextTick()

    const mousemove = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeTruthy()
    expect(cloneItem.element.getAttribute('style')).toBe('transform: translate(50px, 50px) translate(-50%, -50%);')

    const mouseup = new MouseEvent('mouseup', {
      clientX: 50,
      clientY: 50
    })
    document.body.dispatchEvent(mouseup)
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

    const mousedown = new MouseEvent('mousedown', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown)
    await sleep(400)

    const mousemove = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeTruthy()
    expect(cloneItem.element.getAttribute('style')).toBe('transform: translate(50px, 50px) translate(-50%, -50%);')

    const mouseup = new MouseEvent('mouseup', {
      clientX: 50,
      clientY: 50
    })
    document.body.dispatchEvent(mouseup)
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
    const mousedown = new MouseEvent('mousedown', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown)
    await nextTick()

    const mousemove = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeFalsy()

    const mouseup = new MouseEvent('mouseup', {
      clientX: 50,
      clientY: 50
    })
    document.body.dispatchEvent(mouseup)
    await nextTick()

    // move to left
    const mousedown2 = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown2)
    await nextTick()

    const mousemove2 = new MouseEvent('mousemove', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove2)
    await nextTick()

    const cloneItem2 = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem2.exists()).toBeTruthy()
    expect(cloneItem2.element.getAttribute('style')).toBe('transform: translate(10px, 10px) translate(-50%, -50%);')

    const mouseup2 = new MouseEvent('mouseup', {
      clientX: 10,
      clientY: 10
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
    const mousedown = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown)
    await nextTick()

    const mousemove = new MouseEvent('mousemove', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeFalsy()

    const mouseup = new MouseEvent('mouseup', {
      clientX: 10,
      clientY: 10
    })
    document.body.dispatchEvent(mouseup)
    await nextTick()

    // move to left
    const mousedown2 = new MouseEvent('mousedown', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown2)
    await nextTick()

    const mousemove2 = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove2)
    await nextTick()

    const cloneItem2 = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem2.exists()).toBeTruthy()
    expect(cloneItem2.element.getAttribute('style')).toBe('transform: translate(50px, 50px) translate(-50%, -50%);')

    const mouseup2 = new MouseEvent('mouseup', {
      clientX: 50,
      clientY: 50
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
    const mousedown = new MouseEvent('mousedown', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown)
    await nextTick()

    const mousemove = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeFalsy()

    const mouseup = new MouseEvent('mouseup', {
      clientX: 50,
      clientY: 50
    })
    document.body.dispatchEvent(mouseup)
    await nextTick()

    // move to left
    const mousedown2 = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown2)
    await nextTick()

    const mousemove2 = new MouseEvent('mousemove', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove2)
    await nextTick()

    const cloneItem2 = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem2.exists()).toBeTruthy()
    expect(cloneItem2.element.getAttribute('style')).toBe('transform: translate(10px, 10px) translate(-50%, -50%);')

    const mouseup2 = new MouseEvent('mouseup', {
      clientX: 10,
      clientY: 10
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
    const mousedown = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown)
    await nextTick()

    const mousemove = new MouseEvent('mousemove', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove)
    await nextTick()

    const cloneItem = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem.exists()).toBeFalsy()

    const mouseup = new MouseEvent('mouseup', {
      clientX: 10,
      clientY: 10
    })
    document.body.dispatchEvent(mouseup)
    await nextTick()

    // move to left
    const mousedown2 = new MouseEvent('mousedown', {
      clientX: 10,
      clientY: 10,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown2)
    await nextTick()

    const mousemove2 = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove2)
    await nextTick()

    const cloneItem2 = wrapper.find('.hv-draggable .hv-draggable__clone-item')

    expect(cloneItem2.exists()).toBeTruthy()
    expect(cloneItem2.element.getAttribute('style')).toBe('transform: translate(50px, 50px) translate(-50%, -50%);')

    const mouseup2 = new MouseEvent('mouseup', {
      clientX: 50,
      clientY: 50
    })
    document.body.dispatchEvent(mouseup2)
    wrapper.unmount()
  })
})
