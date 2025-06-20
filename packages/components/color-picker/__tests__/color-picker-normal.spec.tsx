import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { HvColorPickerNormal } from '@havue/color-picker'
import { VueNode } from '@vue/test-utils/dist/types'

async function sleep(time) {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}

const CANVAS_WIDTH = 256
const CANVAS_HEIGHT = 256

describe('ColorPicker mouse', () => {
  it.sequential('create', () => {
    const wrapper = mount(HvColorPickerNormal)
    expect(wrapper.props().modelValue).toBe('#FFFFFF')
  })

  describe.sequential('drag', () => {
    const value = ref('#FFFFFF')
    const wrapper = mount(
      () => (
        <div>
          <HvColorPickerNormal v-model={value.value}></HvColorPickerNormal>
        </div>
      ),
      {
        attachTo: document.body
      }
    )

    const colorPicker = wrapper.findComponent({ name: 'HvColorPickerNormal' })

    const area = wrapper.find('.hv-color-picker__color-area-outer')

    spyOnBoundingRect(area.element, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    })

    it.sequential('value change', async () => {
      value.value = '#FF0000'
      await nextTick()
      const circleEL = wrapper.find('.hv-color-picker__circle')
      const computedStyle = window.getComputedStyle(circleEL.element)
      expect(computedStyle.top).toBe(`-${computedStyle.width}`)
      expect(computedStyle.right).toBe(`-${computedStyle.height}`)
      expect(colorPicker.props().modelValue).toBe('#FF0000')
    })

    it.sequential('left top', async () => {
      area.trigger('mousedown', { clientX: 0, clientY: 0 })

      await sleep(50)
      const mousemove = new MouseEvent('mousemove', {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0
      })
      document.body.dispatchEvent(mousemove)
      await sleep(50)

      const mouseup = new MouseEvent('mouseup', {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0
      })
      document.body.dispatchEvent(mouseup)
      await sleep(50)

      expect(value.value).toBe('#FFFFFFFF')
    })

    it.sequential('left bottom', async () => {
      area.trigger('mousedown', { clientX: 0, clientY: CANVAS_HEIGHT })

      await sleep(50)
      const mousemove = new MouseEvent('mousemove', {
        screenX: 0,
        screenY: CANVAS_HEIGHT,
        clientX: 0,
        clientY: CANVAS_HEIGHT
      })
      document.body.dispatchEvent(mousemove)
      await sleep(50)

      const mouseup = new MouseEvent('mouseup', {
        screenX: 0,
        screenY: CANVAS_HEIGHT,
        clientX: 0,
        clientY: CANVAS_HEIGHT
      })
      document.body.dispatchEvent(mouseup)
      await sleep(50)

      expect(value.value).toBe('#000000FF')
    })

    it.sequential('red middle', async () => {
      const targetPoint = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2
      }

      area.trigger('mousedown', { clientX: targetPoint.x, clientY: targetPoint.y })

      await sleep(50)
      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })
      document.body.dispatchEvent(mousemove)
      await sleep(50)

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })
      document.body.dispatchEvent(mouseup)
      await sleep(50)

      expect(value.value).toBe('#804040FF')
    })

    it.sequential('right bottom', async () => {
      const targetPoint = {
        x: CANVAS_WIDTH,
        y: CANVAS_HEIGHT
      }

      area.trigger('mousedown', { clientX: targetPoint.x, clientY: targetPoint.y })

      await sleep(50)
      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })
      document.body.dispatchEvent(mousemove)
      await sleep(50)

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })
      document.body.dispatchEvent(mouseup)
      await sleep(50)

      expect(value.value).toBe('#000000FF')
    })

    it.sequential('right top', async () => {
      const targetPoint = {
        x: CANVAS_WIDTH,
        y: 0
      }

      area.trigger('mousedown', { clientX: targetPoint.x, clientY: targetPoint.y })

      await sleep(50)
      const mousemove = new MouseEvent('mousemove', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })
      document.body.dispatchEvent(mousemove)
      await sleep(50)

      const mouseup = new MouseEvent('mouseup', {
        screenX: targetPoint.x,
        screenY: targetPoint.y,
        clientX: targetPoint.x,
        clientY: targetPoint.y
      })
      document.body.dispatchEvent(mouseup)
      await sleep(50)

      expect(value.value).toBe('#FF0000FF')
    })

    it.sequential('hue change', async () => {
      const slider = wrapper.find('.hv-color-picker__hue-slider .el-slider__runway')
      const element = slider.element
      vi.spyOn(element, 'clientWidth', 'get').mockImplementation(() => 360)
      vi.spyOn(element, 'clientHeight', 'get').mockImplementation(() => 1)
      vi.spyOn(element, 'clientLeft', 'get').mockImplementation(() => 0)
      vi.spyOn(element, 'clientTop', 'get').mockImplementation(() => 0)

      spyOnBoundingRect(element, {
        width: 360,
        height: 1
      })

      const centerPoint = {
        x: 180,
        y: 0
      }

      slider.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y })
      await sleep(50)
      slider.trigger('mousemove', { clientX: centerPoint.x, clientY: centerPoint.y })
      await sleep(50)
      slider.trigger('mouseup', { clientX: centerPoint.x, clientY: centerPoint.y })

      await sleep(50)

      expect(value.value).toBe('#00FFFFFF')

      const leftPoint = {
        x: 0,
        y: 0
      }

      slider.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y })
      await sleep(50)
      slider.trigger('mousemove', { clientX: leftPoint.x, clientY: leftPoint.y })
      await sleep(50)
      slider.trigger('mouseup', { clientX: leftPoint.x, clientY: leftPoint.y })

      await sleep(50)
      expect(value.value).toBe('#FF0000FF')
    })

    it.sequential('opacity change', async () => {
      const slider = wrapper.find('.hv-color-picker__alpha-slider .el-slider__runway')
      const element = slider.element
      vi.spyOn(element, 'clientWidth', 'get').mockImplementation(() => 100)
      vi.spyOn(element, 'clientHeight', 'get').mockImplementation(() => 1)
      vi.spyOn(element, 'clientLeft', 'get').mockImplementation(() => 0)
      vi.spyOn(element, 'clientTop', 'get').mockImplementation(() => 0)

      spyOnBoundingRect(element, {
        width: 100,
        height: 1
      })

      const centerPoint = {
        x: 50,
        y: 0
      }

      slider.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y })
      await sleep(50)
      slider.trigger('mousemove', { clientX: centerPoint.x, clientY: centerPoint.y })
      await sleep(50)
      slider.trigger('mouseup', { clientX: centerPoint.x, clientY: centerPoint.y })

      await sleep(50)

      expect(value.value).toBe('#FF000080')

      const leftPoint = {
        x: 0,
        y: 0
      }

      slider.trigger('mousedown', { clientX: centerPoint.x, clientY: centerPoint.y })
      await sleep(50)
      slider.trigger('mousemove', { clientX: leftPoint.x, clientY: leftPoint.y })
      await sleep(50)
      slider.trigger('mouseup', { clientX: leftPoint.x, clientY: leftPoint.y })

      await sleep(50)
      expect(value.value).toBe('#FF000000')
    })
  })
})

function spyOnBoundingRect(element: VueNode<Element>, options: Partial<DOMRect>) {
  vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => {
    return {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
      ...options
    }
  })
}
