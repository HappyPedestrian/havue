import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useFullScreenAdapt } from '@havue/hooks'

describe.sequential('useFullScreenAdapt', async () => {
  const domEl = document.documentElement
  vi.spyOn(domEl, 'clientWidth', 'get').mockImplementation(() => 2000)
  vi.spyOn(domEl, 'clientHeight', 'get').mockImplementation(() => 1000)

  const wrapper = mount(
    () => {
      useFullScreenAdapt(500, 500, 20)
      return (
        <div>
          <input></input>
        </div>
      )
    },
    {
      attachTo: document.body
    }
  )
  await nextTick()
  it('adapt', async () => {
    expect(domEl.style.fontSize).toBe('40px')
  })

  it('no stop on focus input', async () => {
    const input = wrapper.find('input')
    input.trigger('focus')
    await nextTick()

    vi.spyOn(domEl, 'clientHeight', 'get').mockImplementation(() => 500)
    domEl.dispatchEvent(new Event('resize', { bubbles: true }))
    await nextTick()

    expect(domEl.style.fontSize).toBe('20px')

    wrapper.unmount()
  })
})
