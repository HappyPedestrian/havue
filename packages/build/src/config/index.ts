import type { UserConfig } from 'vite'
import type { ModeType } from '../types'
import { getComponentConfig } from './components'
import { getJsLibConfig } from './jsLib'
import { compRoot } from '../utils/paths'
import { absCwd } from '../utils'

export * from './components'
export * from './jsLib'

export function getConfig(mode: string = 'package', options?: UserConfig) {
  const cwd = absCwd()
  if (cwd.startsWith(compRoot)) {
    return getComponentConfig(mode as ModeType, options)
  }
  return getJsLibConfig(mode as ModeType, options)
}
