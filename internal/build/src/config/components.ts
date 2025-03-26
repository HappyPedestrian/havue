import type { ModeType } from '../types'
import { mergeConfig, UserConfig } from 'vite'
import { getViteConfig } from '../vite-config/configOptions'

export async function getComponentConfig(mode: ModeType, options?: UserConfig) {
  const config = await getViteConfig(mode)
  return mergeConfig(config, options || {}) as UserConfig
}
