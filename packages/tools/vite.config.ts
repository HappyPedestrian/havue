import { defineConfig } from 'vite'
import { getConfig } from '@havue/build'

export default defineConfig(({ mode }) => getConfig(mode))
