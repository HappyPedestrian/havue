import { defineConfig } from 'vite'
import { getConfig } from '../../../internal/build/src'

export default defineConfig(({ mode }) => getConfig(mode))
