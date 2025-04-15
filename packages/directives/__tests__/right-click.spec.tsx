import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import RightClick from './RightClick.vue'

describe('Directives', () => {
  describe.sequential('RightClick', async () => {
    const wrapper = mount(RightClick, {
      attachTo: document.body
    })

    await nextTick()

    it('down-up', async () => {
      const item1 = wrapper.find('.box .item1')

      await item1.trigger('mousedown', { clientX: 50, clientY: 50, buttons: 2 })

      let emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toBeUndefined()

      const mouseup = new MouseEvent('mouseup', {
        clientX: 50,
        clientY: 50,
        screenX: 50,
        screenY: 50,
        buttons: 0
      })
      item1.element.dispatchEvent(mouseup)
      await nextTick()

      emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toHaveLength(1)
    })

    it('contextmenu', async () => {
      const item2 = wrapper.find('.box .item2')

      const contextmenu = new MouseEvent('contextmenu', {
        clientX: 50,
        clientY: 150,
        screenX: 50,
        screenY: 150,
        buttons: 0
      })
      item2.element.dispatchEvent(contextmenu)
      await nextTick()

      const emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toHaveLength(1)
      expect(emitted['contextmenu']).toHaveLength(1)
    })

    it('contextmenu-prevent', async () => {
      const item3 = wrapper.find('.box .item3')

      const contextmenu = new MouseEvent('contextmenu', {
        clientX: 50,
        clientY: 250,
        screenX: 50,
        screenY: 250,
        buttons: 0
      })
      item3.element.dispatchEvent(contextmenu)
      await nextTick()
      const emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toHaveLength(1)
      expect(emitted['contextmenu']).toHaveLength(1)
      expect(emitted['contextmenu-prevent']).toHaveLength(1)
    })

    it('down-prevent', async () => {
      const item4 = wrapper.find('.box .item4')

      await item4.trigger('mousedown', { clientX: 50, clientY: 350, buttons: 2 })

      const contextmenu = new MouseEvent('mouseup', {
        clientX: 50,
        clientY: 350,
        screenX: 50,
        screenY: 350,
        buttons: 0
      })
      item4.element.dispatchEvent(contextmenu)
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

      await item5Child.trigger('mousedown', { clientX: 50, clientY: 450, buttons: 2 })

      const contextmenu = new MouseEvent('mouseup', {
        clientX: 50,
        clientY: 450,
        screenX: 50,
        screenY: 450,
        buttons: 0
      })
      item5Child.element.dispatchEvent(contextmenu)
      await nextTick()
      const emitted = wrapper.emitted()
      expect(emitted['right-click-down']).toHaveLength(1)
      expect(emitted['right-click-up']).toHaveLength(1)
      expect(emitted['contextmenu']).toHaveLength(1)
      expect(emitted['right-click-prevent']).toHaveLength(1)
      expect(emitted['right-click-stop']).toHaveLength(1)
    })
  })
})
