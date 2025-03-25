import { defineConfig } from 'vite'
import { getConfig } from '../../build/src'

export default defineConfig(({ mode }) => getConfig(mode))
