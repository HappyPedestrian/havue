import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import RightClick from './RightClick.vue'

// 提取公共坐标常量
const COORDINATES = {
  ITEM1: { x: 50, y: 50 },
  ITEM2: { x: 50, y: 150 },
  ITEM3: { x: 50, y: 250 },
  ITEM4: { x: 50, y: 350 },
  ITEM5: { x: 50, y: 450 },
  ITEM6: { x: 50, y: 550 },
  ITEM7: { x: 50, y: 600 }
}

// 辅助函数：创建mousedown事件
const createMouseDownEvent = (x: number, y: number) => ({
  clientX: x,
  clientY: y,
  buttons: 2
})

// 辅助函数：创建mouseup事件
const createMouseUpEvent = (x: number, y: number) =>
  new MouseEvent('mouseup', {
    clientX: x,
    clientY: y,
    screenX: x,
    screenY: y,
    buttons: 0
  })

// 辅助函数：创建contextmenu事件
const createContextMenuEvent = (x: number, y: number) =>
  new MouseEvent('contextmenu', {
    clientX: x,
    clientY: y,
    screenX: x,
    screenY: y,
    buttons: 0
  })

describe('Directives', () => {
  describe.sequential('RightClick', async () => {
    const wrapper = mount(RightClick, {
      attachTo: document.body
    })

    await nextTick()

    it('down-up', async () => {
      const item1 = wrapper.find('.box .item1')
      const coords = COORDINATES.ITEM1

      await item1.trigger('mousedown', createMouseDownEvent(coords.x, coords.y))

      let emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toBeUndefined()

      item1.element.dispatchEvent(createMouseUpEvent(coords.x, coords.y))
      await nextTick()

      emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toHaveLength(1)
    })

    it('contextmenu', async () => {
      const item2 = wrapper.find('.box .item2')
      const coords = COORDINATES.ITEM2

      item2.element.dispatchEvent(createContextMenuEvent(coords.x, coords.y))
      await nextTick()

      const emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toHaveLength(1)
      expect(emitted['contextmenu']).toHaveLength(1)
    })

    it('contextmenu-prevent', async () => {
      const item3 = wrapper.find('.box .item3')
      const coords = COORDINATES.ITEM3

      item3.element.dispatchEvent(createContextMenuEvent(coords.x, coords.y))
      await nextTick()

      const emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toHaveLength(1)
      expect(emitted['contextmenu']).toHaveLength(1)
      expect(emitted['contextmenu-prevent']).toHaveLength(1)
    })

    it('down-prevent', async () => {
      const item4 = wrapper.find('.box .item4')
      const coords = COORDINATES.ITEM4

      await item4.trigger('mousedown', createMouseDownEvent(coords.x, coords.y))

      item4.element.dispatchEvent(createMouseUpEvent(coords.x, coords.y))
      await nextTick()

      const emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toHaveLength(1)
      expect(emitted['contextmenu']).toHaveLength(1)
      expect(emitted['right-click-prevent']).toHaveLength(1)
    })

    it('down-stop', async () => {
      const item5 = wrapper.find('.box .item5')
      const item5Child = item5.find('.child')
      const coords = COORDINATES.ITEM5

      await item5Child.trigger('mousedown', createMouseDownEvent(coords.x, coords.y))

      item5Child.element.dispatchEvent(createMouseUpEvent(coords.x, coords.y))
      await nextTick()

      const emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toHaveLength(1)
      expect(emitted['contextmenu']).toHaveLength(1)
      expect(emitted['right-click-prevent']).toHaveLength(1)
      expect(emitted['right-click-stop']).toHaveLength(1)
    })

    it('down-capture', async () => {
      const item6 = wrapper.find('.box .item6')
      const item6Child = item6.find('.child')
      const coords = COORDINATES.ITEM6

      await item6Child.trigger('mousedown', createMouseDownEvent(coords.x, coords.y))

      const downCaptureEmitQuery = wrapper.vm['downCaptureEmitQuery']
      expect(downCaptureEmitQuery).toEqual(['right-click-down-capture', 'right-click-down-capture-child'])
    })

    it('up-capture', async () => {
      const item7 = wrapper.find('.box .item7')
      const item7Child = item7.find('.child')
      const coords = COORDINATES.ITEM7

      await item7Child.trigger('mousedown', createMouseDownEvent(coords.x, coords.y))

      item7Child.element.dispatchEvent(createMouseUpEvent(coords.x, coords.y))
      await nextTick()

      const upCaptureEmitQuery = wrapper.vm['upCaptureEmitQuery']
      expect(upCaptureEmitQuery).toEqual(['right-click-up-capture', 'right-click-up-capture-child'])
    })
  })
})
