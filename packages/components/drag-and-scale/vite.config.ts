import { defineConfig } from 'vite'
import { getConfig } from '@pedy/build'

export default defineConfig(({ mode }) => getConfig(mode))
