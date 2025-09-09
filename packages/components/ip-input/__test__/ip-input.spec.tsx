import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { userEvent } from '@vitest/browser/context'
import { HvIpInput } from '@havue/ip-input'

describe('Ip input', () => {
  it.sequential('create', () => {
    const wrapper = mount(HvIpInput)
    expect(wrapper.props().modelValue).toBe('...')
  })

  it('disabled', () => {
    const wrapper = mount(() => <HvIpInput disabled={true}></HvIpInput>)
    expect(wrapper.find('.hv-ip-input.is-disabled').exists()).toBeTruthy()
  })

  describe.sequential('operate', () => {
    const oldValue = '192.168.1.1'
    const value = ref(oldValue)
    const wrapper = mount(
      () => (
        <div>
          <HvIpInput v-model:model-value={value.value}></HvIpInput>
        </div>
      ),
      {
        attachTo: document.body
      }
    )

    const ipInput = wrapper.findComponent({ name: 'HvIpInput' })

    it.sequential('value change', async () => {
      expect(ipInput.props().modelValue).toBe(oldValue)
      const newVal = '192.168.1.2'
      value.value = newVal
      await nextTick()
      expect(ipInput.props().modelValue).toBe(newVal)
    })

    const inputList = wrapper.findAll('input')

    it.sequential('input1 change max', async () => {
      await userEvent.fill(inputList[0].element, '999')
      expect(inputList[0].element.value).toBe('255')
      expect(document.activeElement).toBe(inputList[1].element)

      await userEvent.fill(inputList[1].element, '999')
      expect(inputList[1].element.value).toBe('255')
      expect(document.activeElement).toBe(inputList[2].element)
    })

    it.sequential('input1 change min', async () => {
      await userEvent.fill(inputList[0].element, '-999')
      expect(inputList[0].element.value).toBe('0')
      expect(document.activeElement).toBe(inputList[0].element)

      await userEvent.fill(inputList[1].element, '-999')
      expect(inputList[1].element.value).toBe('0')
      expect(document.activeElement).toBe(inputList[1].element)
    })

    it.sequential('input1 change invalid', async () => {
      await userEvent.fill(inputList[0].element, 'abcd')
      expect(inputList[0].element.value).toBe('')
      expect(document.activeElement).toBe(inputList[0].element)

      await userEvent.fill(inputList[1].element, '-cdf')
      expect(inputList[1].element.value).toBe('')
      expect(document.activeElement).toBe(inputList[1].element)
    })

    it.sequential('input1 change normal', async () => {
      value.value = oldValue
      await nextTick()
      // 19.168.1.1
      await userEvent.fill(inputList[0].element, '19')
      expect(document.activeElement).toBe(inputList[0].element)

      // 192.168.1.1
      await userEvent.fill(inputList[0].element, '192')

      expect(document.activeElement).toBe(inputList[1].element)

      expect(ipInput.props().modelValue).toBe(oldValue)

      // backspace最后一个input值，此时为192.168.1.
      inputList[3].trigger('keydown', { keyCode: 8 })
      await userEvent.clear(inputList[3].element)
      expect(document.activeElement).toBe(inputList[3].element)
      inputList[3].trigger('keyup')
      await nextTick()

      // 再次backspace最后一个input值
      inputList[3].trigger('keydown', { keyCode: 8 })
      await userEvent.clear(inputList[2].element)
      inputList[3].trigger('keyup')
      await nextTick()
      expect(document.activeElement).toBe(inputList[2].element)
      expect(ipInput.props().modelValue).toBe('192.168..')
    })

    it.sequential('paste normal', async () => {
      const user = userEvent.setup()
      const type = 'text/plain'
      const clipboardItemData = {
        [type]: '255.255.255.0'
      }
      const clipboardItem = new ClipboardItem(clipboardItemData)
      await navigator.clipboard.write([clipboardItem])
      inputList[0].element.focus()
      await user.paste()
      await nextTick()
      expect(ipInput.props().modelValue).toBe('255.255.255.0')
    })

    it.sequential('paste invalid', async () => {
      value.value = oldValue
      await nextTick()
      const user = userEvent.setup()
      const type = 'text/plain'
      const clipboardItemData = {
        [type]: 'lllabc.efg.hij.lmn'
      }
      const clipboardItem = new ClipboardItem(clipboardItemData)
      await navigator.clipboard.write([clipboardItem])
      inputList[0].element.focus()
      await user.paste()
      await nextTick()
      expect(ipInput.props().modelValue).toBe(oldValue)
    })

    it.sequential('paste invalid2', async () => {
      value.value = oldValue
      await nextTick()
      const user = userEvent.setup()
      const type = 'text/plain'
      const clipboardItemData = {
        [type]: '-999.999.-255.256'
      }
      const clipboardItem = new ClipboardItem(clipboardItemData)
      await navigator.clipboard.write([clipboardItem])
      inputList[0].element.focus()
      await user.paste()
      await nextTick()
      expect(ipInput.props().modelValue).toBe('0.255.0.255')
    })
  })
})
