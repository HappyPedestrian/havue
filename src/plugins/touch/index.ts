import type { App, Plugin } from 'vue'
import { VTouch, VTouchConfig, VGhostClick } from './directives'

const touchPlugin: Plugin = {
  install(app: App) {
    app.directive('touch', VTouch)
    app.directive('touch-config', VTouchConfig)
    app.directive('ghost-click', VGhostClick)
  }
}

export default touchPlugin
export { touchPlugin }
export { DIRECTIONS, MODIFIERS } from './directives'
