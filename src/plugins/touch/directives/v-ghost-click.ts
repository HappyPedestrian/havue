import type { Directive, DirectiveBinding } from 'vue'

let coordinates: [number, number][] = []
const threshold = 25
const timeout = 2500
let isDocumentAddListener = false

function preventGhostClick(ev: MouseEvent) {
  for (let i = 0; i < coordinates.length; i++) {
    const x = coordinates[i][0]
    const y = coordinates[i][1]

    // within the range, so prevent the click
    if (Math.abs(ev.clientX - x) < threshold && Math.abs(ev.clientY - y) < threshold) {
      ev.stopPropagation()
      ev.preventDefault()
      break
    }
  }
}

function registerCoordinates(ev: TouchEvent) {
  if (ev.touches.length - ev.changedTouches.length <= 0) {
    const touch = ev.changedTouches[0]
    coordinates.push([touch.clientX, touch.clientY])

    setTimeout(() => {
      coordinates.splice(0, 1)
    }, timeout)
  }
}

function resetCoordinates() {
  coordinates = []
}

// v-ghost-click 指令: 是否阻止幽灵点击
const VGhostClick: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    const { value } = binding

    el.removeEventListener('touchstart', resetCoordinates, true)
    el.removeEventListener('touchend', registerCoordinates, true)

    if (!value) {
      if (!isDocumentAddListener) {
        isDocumentAddListener = true

        // 避免重复绑定
        document.addEventListener('click', preventGhostClick, true)
      }

      el.addEventListener('touchstart', resetCoordinates, { capture: true, passive: true })
      el.addEventListener('touchend', registerCoordinates, true)
    }
  },

  beforeUnmount(el: HTMLElement) {
    el.removeEventListener('touchstart', resetCoordinates, true)
    el.removeEventListener('touchend', registerCoordinates, true)
  }
}

export { VGhostClick }
