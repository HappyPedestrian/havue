import type { UserConfig } from 'vite'
import { mergeConfig } from 'vite'
import { getViteConfig } from '../vite-config'
import { ModeType } from '../types'

export async function getJsLibConfig(mode: ModeType, options?: UserConfig) {
  const config = await getViteConfig(mode)
  return mergeConfig(config, options || {})
}
