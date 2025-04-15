import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { HvDragAndScale } from '@havue/drag-and-scale'
import DragTest from './DragTest.vue'
import { VueNode } from '@vue/test-utils/dist/types'

describe.sequential('DragAndScale mouse', () => {
  it('create', () => {
    const containerRef = ref()
    const wrapper = mount(() => (
      <div ref="containerRef">
        <HvDragAndScale container={containerRef}></HvDragAndScale>
      </div>
    ))
    expect(wrapper.find('.hv-drag-and-scale').exists()).toBeTruthy()
  })

  it('disabled', () => {
    const containerRef = ref()
    const wrapper = mount(() => (
      <div ref="containerRef">
        <HvDragAndScale container={containerRef} disabled={true}></HvDragAndScale>
      </div>
    ))
    expect(wrapper.find('.hv-drag-and-scale__area-box.disabled').exists()).toBeTruthy()
  })

  describe('drag', async () => {
    const wrapper = mount(DragTest, {
      attachTo: document.body
    })

    const dragAndScale = wrapper.getComponent({ name: 'HvDragAndScale' })
    const dragMiddleCenterEl = wrapper.find(
      '.hv-drag-and-scale__area-box .hv-drag-and-scale__area-middle .hv-drag-and-scale__area-center'
    )

    await nextTick()

    it('normal move', async () => {
      const centerPoint = getElementCenterPoint(dragMiddleCenterEl.element)
      const targetPoint = {
        x: centerPoint.x + 50,
        y: centerPoint.y + 50
      }
      await dragMiddleCenterEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(dragAndScale.emitted()).toHaveProperty('change')
      expect(dragAndScale.emitted()).toHaveProperty('finish')
      expect(computedStyle.top).toBe('100px')
      expect(computedStyle.left).toBe('100px')
    })

    it('limit move', async () => {
      const centerPoint = getElementCenterPoint(dragMiddleCenterEl.element)
      const targetPoint = {
        x: centerPoint.x - 500,
        y: centerPoint.y - 500
      }
      await dragMiddleCenterEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(computedStyle.top).toBe('0px')
      expect(computedStyle.left).toBe('0px')
      expect(computedStyle.width).toBe('100px')
      expect(computedStyle.height).toBe('100px')
    })
  })

  describe('scale', async () => {
    it('left', async () => {
      const wrapper = mount(DragTest, {
        attachTo: document.body
      })
      const dragAndScale = wrapper.getComponent({ name: 'HvDragAndScale' })

      const dragMiddleLeftEl = wrapper.find(
        '.hv-drag-and-scale__area-box .hv-drag-and-scale__area-middle .hv-drag-and-scale__area-left'
      )
      await nextTick()

      const centerPoint = getElementCenterPoint(dragMiddleLeftEl.element)
      const targetPoint = {
        x: centerPoint.x + 50,
        y: centerPoint.y + 50
      }

      await dragMiddleLeftEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(computedStyle.top).toBe('50px')
      expect(computedStyle.left).toBe('100px')
      expect(computedStyle.width).toBe('50px')
      expect(computedStyle.height).toBe('100px')
      wrapper.unmount()
    })

    it('right', async () => {
      const wrapper = mount(DragTest, {
        attachTo: document.body
      })
      const dragAndScale = wrapper.getComponent({ name: 'HvDragAndScale' })

      const dragMiddleRightEl = wrapper.find(
        '.hv-drag-and-scale__area-box .hv-drag-and-scale__area-middle .hv-drag-and-scale__area-right'
      )
      await nextTick()

      const centerPoint = getElementCenterPoint(dragMiddleRightEl.element)
      const targetPoint = {
        x: centerPoint.x + 50,
        y: centerPoint.y + 50
      }

      await dragMiddleRightEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(computedStyle.top).toBe('50px')
      expect(computedStyle.left).toBe('50px')
      expect(computedStyle.width).toBe('150px')
      expect(computedStyle.height).toBe('100px')
      wrapper.unmount()
    })

    it('top', async () => {
      const wrapper = mount(DragTest, {
        attachTo: document.body
      })
      const dragAndScale = wrapper.getComponent({ name: 'HvDragAndScale' })

      const dragTopCenterEl = wrapper.find(
        '.hv-drag-and-scale__area-box .hv-drag-and-scale__area-top .hv-drag-and-scale__area-center'
      )
      await nextTick()

      const centerPoint = getElementCenterPoint(dragTopCenterEl.element)
      const targetPoint = {
        x: centerPoint.x + 50,
        y: centerPoint.y + 50
      }

      await dragTopCenterEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(computedStyle.top).toBe('100px')
      expect(computedStyle.left).toBe('50px')
      expect(computedStyle.width).toBe('100px')
      expect(computedStyle.height).toBe('50px')
      wrapper.unmount()
    })

    it('bottom', async () => {
      const wrapper = mount(DragTest, {
        attachTo: document.body
      })
      const dragAndScale = wrapper.getComponent({ name: 'HvDragAndScale' })

      const dragBottomCenterEl = wrapper.find(
        '.hv-drag-and-scale__area-box .hv-drag-and-scale__area-bottom .hv-drag-and-scale__area-center'
      )
      await nextTick()

      const centerPoint = getElementCenterPoint(dragBottomCenterEl.element)
      const targetPoint = {
        x: centerPoint.x + 50,
        y: centerPoint.y + 50
      }

      await dragBottomCenterEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(computedStyle.top).toBe('50px')
      expect(computedStyle.left).toBe('50px')
      expect(computedStyle.width).toBe('100px')
      expect(computedStyle.height).toBe('150px')
      wrapper.unmount()
    })

    it('left-top', async () => {
      const wrapper = mount(DragTest, {
        attachTo: document.body
      })
      const dragAndScale = wrapper.getComponent({ name: 'HvDragAndScale' })

      const dragTopLeftEl = wrapper.find(
        '.hv-drag-and-scale__area-box .hv-drag-and-scale__area-top .hv-drag-and-scale__area-left'
      )
      await nextTick()

      const centerPoint = getElementCenterPoint(dragTopLeftEl.element)
      const targetPoint = {
        x: centerPoint.x + 50,
        y: centerPoint.y + 50
      }

      await dragTopLeftEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(computedStyle.top).toBe('100px')
      expect(computedStyle.left).toBe('100px')
      expect(computedStyle.width).toBe('50px')
      expect(computedStyle.height).toBe('50px')
      wrapper.unmount()
    })

    it('left-bottom', async () => {
      const wrapper = mount(DragTest, {
        attachTo: document.body
      })
      const dragAndScale = wrapper.getComponent({ name: 'HvDragAndScale' })

      const dragBottomLeftEl = wrapper.find(
        '.hv-drag-and-scale__area-box .hv-drag-and-scale__area-bottom .hv-drag-and-scale__area-left'
      )
      await nextTick()

      const centerPoint = getElementCenterPoint(dragBottomLeftEl.element)
      const targetPoint = {
        x: centerPoint.x + 50,
        y: centerPoint.y + 50
      }

      await dragBottomLeftEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(computedStyle.top).toBe('50px')
      expect(computedStyle.left).toBe('100px')
      expect(computedStyle.width).toBe('50px')
      expect(computedStyle.height).toBe('150px')
      wrapper.unmount()
    })

    it('right-top', async () => {
      const wrapper = mount(DragTest, {
        attachTo: document.body
      })
      const dragAndScale = wrapper.getComponent({ name: 'HvDragAndScale' })

      const dragTopRightEl = wrapper.find(
        '.hv-drag-and-scale__area-box .hv-drag-and-scale__area-top .hv-drag-and-scale__area-right'
      )
      await nextTick()

      const centerPoint = getElementCenterPoint(dragTopRightEl.element)
      const targetPoint = {
        x: centerPoint.x + 50,
        y: centerPoint.y + 50
      }

      await dragTopRightEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(computedStyle.top).toBe('100px')
      expect(computedStyle.left).toBe('50px')
      expect(computedStyle.width).toBe('150px')
      expect(computedStyle.height).toBe('50px')
      wrapper.unmount()
    })

    it('right-bottom', async () => {
      const wrapper = mount(DragTest, {
        attachTo: document.body
      })
      const dragAndScale = wrapper.getComponent({ name: 'HvDragAndScale' })

      const dragBottomRightEl = wrapper.find(
        '.hv-drag-and-scale__area-box .hv-drag-and-scale__area-bottom .hv-drag-and-scale__area-right'
      )
      await nextTick()

      const centerPoint = getElementCenterPoint(dragBottomRightEl.element)
      const targetPoint = {
        x: centerPoint.x + 50,
        y: centerPoint.y + 50
      }

      await dragBottomRightEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(computedStyle.top).toBe('50px')
      expect(computedStyle.left).toBe('50px')
      expect(computedStyle.width).toBe('150px')
      expect(computedStyle.height).toBe('150px')
      wrapper.unmount()
    })
  })

  describe('not limit in container', async () => {
    it('drag', async () => {
      const wrapper = mount(() => <DragTest limitInContainer={false}></DragTest>, {
        attachTo: document.body
      })
      const dragAndScale = wrapper.getComponent({ name: 'HvDragAndScale' })

      const dragMiddleCenterEl = wrapper.find(
        '.hv-drag-and-scale__area-box .hv-drag-and-scale__area-middle .hv-drag-and-scale__area-center'
      )
      await nextTick()

      const centerPoint = getElementCenterPoint(dragMiddleCenterEl.element)
      const targetPoint = {
        x: centerPoint.x - 100,
        y: centerPoint.y - 100
      }

      await dragMiddleCenterEl.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y, buttons: 1 })

      await nextTick()

      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y,
        buttons: 1
      })

      document.body.dispatchEvent(mousemove)
      await nextTick()

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })

      document.body.dispatchEvent(mouseup)
      await nextTick()

      const computedStyle = window.getComputedStyle(dragAndScale.element)

      expect(computedStyle.top).toBe('-50px')
      expect(computedStyle.left).toBe('-50px')
      expect(computedStyle.width).toBe('100px')
      expect(computedStyle.height).toBe('100px')
      wrapper.unmount()
    })
  })
})

function getElementCenterPoint(element: VueNode<Element>) {
  const rect = element.getBoundingClientRect()
  const { left, top, width, height } = rect
  return {
    x: left + width / 2,
    y: top + height / 2
  }
}
