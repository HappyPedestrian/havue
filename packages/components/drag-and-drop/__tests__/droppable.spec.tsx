import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { HvDroppable } from '@havue/drag-and-drop'
import { nextTick } from 'vue'
import DnD from './DnD.vue'

describe('HvDroppable mouse', () => {
  test('create', () => {
    const wrapper = mount(HvDroppable, {
      props: {
        acceptDragType: 'test'
      }
    })
    expect(wrapper.find('.hv-droppable').exists()).toBeTruthy()
    expect(wrapper.props().acceptDragType).toBe('test')
    wrapper.unmount()
  })

  test('acceptDragType', async () => {
    const wrapper = mount(DnD, {
      attachTo: document.body
    })
    await nextTick()

    const droppable = wrapper.findComponent({
      name: 'HvDroppable'
    })

    // move drag2
    const mousedown2 = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 150,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown2)
    await nextTick()

    const mousemove2 = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 150,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove2)
    await nextTick()

    const draggable2 = wrapper.find('.drag2')

    const draggable2CloneItem = draggable2.find('.hv-draggable__clone-item')

    expect(draggable2CloneItem.exists()).toBeTruthy()

    expect(droppable.emitted('enter')).toBeUndefined()

    const mouseup2 = new MouseEvent('mouseup', {
      clientX: 150,
      clientY: 150
    })
    document.body.dispatchEvent(mouseup2)

    // move drag1
    const mousedown1 = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousedown1)
    await nextTick()

    // enter
    const mousemove1_1 = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove1_1)
    await nextTick()

    const draggable1 = wrapper.find('.drag1')

    const draggable1CloneItem = draggable1.find('.hv-draggable__clone-item')

    expect(draggable1CloneItem.exists()).toBeTruthy()

    const enterEmit = droppable.emitted('enter')
    expect(enterEmit).toBeDefined()
    expect(enterEmit).toHaveLength(1)
    expect(enterEmit && enterEmit[0]).toEqual(['test1', { x: 50, y: 50 }, 'data1'])

    // leave
    const mousemove1_2 = new MouseEvent('mousemove', {
      clientX: 1500,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove1_2)
    await nextTick()

    const leaveEmit = droppable.emitted('leave')
    expect(leaveEmit).toBeDefined()
    expect(leaveEmit).toHaveLength(1)
    expect(leaveEmit && leaveEmit[0]).toEqual(['test1', 'data1'])

    // enter
    const mousemove1_3 = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove1_3)
    await nextTick()

    // move
    const mousemove1_4 = new MouseEvent('mousemove', {
      clientX: 151,
      clientY: 50,
      buttons: 1
    })
    document.body.dispatchEvent(mousemove1_4)
    await nextTick()

    const moveEmit = droppable.emitted('move')
    expect(moveEmit).toBeDefined()
    expect(moveEmit).toHaveLength(1)
    expect(moveEmit && moveEmit[0]).toEqual(['test1', { x: 51, y: 50 }, 'data1'])

    // drop
    const mouseup1 = new MouseEvent('mouseup', {
      clientX: 151,
      clientY: 150
    })
    document.body.dispatchEvent(mouseup1)
    await nextTick()

    const dropEmit = droppable.emitted('drop')
    expect(dropEmit).toBeDefined()
    expect(dropEmit).toHaveLength(1)
    expect(dropEmit && dropEmit[0]).toEqual(['test1', { x: 51, y: 50 }, 'data1'])
  })
})
