import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DnD from './DnD.vue'

describe('HvDroppable touch', () => {
  test('acceptDragType', async () => {
    const wrapper = mount(DnD, {
      attachTo: document.body
    })
    await nextTick()

    const droppable = wrapper.findComponent({
      name: 'HvDroppable'
    })

    // move drag2
    const touchstart2 = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 50, clientY: 150, identifier: 1, target: document.body })]
    })
    document.body.dispatchEvent(touchstart2)
    await nextTick()

    const touchmove2 = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 150, clientY: 150, identifier: 1, target: document.body })]
    })
    document.body.dispatchEvent(touchmove2)
    await nextTick()

    const draggable2 = wrapper.find('.drag2')

    const draggable2CloneItem = draggable2.find('.hv-draggable__clone-item')

    expect(draggable2CloneItem.exists()).toBeTruthy()

    expect(droppable.emitted('enter')).toBeUndefined()

    const touchend2 = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(touchend2)

    // move drag1
    const touchstart1 = new TouchEvent('touchstart', {
      touches: [new Touch({ clientX: 50, clientY: 50, identifier: 1, target: document.body })]
    })
    document.body.dispatchEvent(touchstart1)
    await nextTick()

    // enter
    const touchmove1_1 = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 150, clientY: 50, identifier: 1, target: document.body })]
    })
    document.body.dispatchEvent(touchmove1_1)
    await nextTick()

    const draggable1 = wrapper.find('.drag1')

    const draggable1CloneItem = draggable1.find('.hv-draggable__clone-item')

    expect(draggable1CloneItem.exists()).toBeTruthy()

    const enterEmit = droppable.emitted('enter')
    expect(enterEmit).toBeDefined()
    expect(enterEmit).toHaveLength(1)
    expect(enterEmit && enterEmit[0]).toEqual(['test1', { x: 50, y: 50 }, 'data1'])

    // leave
    const touchmove1_2 = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 1500, clientY: 50, identifier: 1, target: document.body })]
    })
    document.body.dispatchEvent(touchmove1_2)
    await nextTick()

    const leaveEmit = droppable.emitted('leave')
    expect(leaveEmit).toBeDefined()
    expect(leaveEmit).toHaveLength(1)
    expect(leaveEmit && leaveEmit[0]).toEqual(['test1', 'data1'])

    // enter
    const touchmove1_3 = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 150, clientY: 50, identifier: 1, target: document.body })]
    })
    document.body.dispatchEvent(touchmove1_3)
    await nextTick()

    // move
    const touchmove1_4 = new TouchEvent('touchmove', {
      touches: [new Touch({ clientX: 151, clientY: 50, identifier: 1, target: document.body })]
    })
    document.body.dispatchEvent(touchmove1_4)
    await nextTick()

    const moveEmit = droppable.emitted('move')
    expect(moveEmit).toBeDefined()
    expect(moveEmit).toHaveLength(1)
    expect(moveEmit && moveEmit[0]).toEqual(['test1', { x: 51, y: 50 }, 'data1'])

    // drop
    const touchend1 = new TouchEvent('touchend', {
      touches: []
    })
    document.body.dispatchEvent(touchend1)
    await nextTick()

    const dropEmit = droppable.emitted('drop')
    expect(dropEmit).toBeDefined()
    expect(dropEmit).toHaveLength(1)
    expect(dropEmit && dropEmit[0]).toEqual(['test1', { x: 51, y: 50 }, 'data1'])
  })
})
