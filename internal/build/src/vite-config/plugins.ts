import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import libCss from 'vite-plugin-libcss'
import { absCwd, compRoot, directiveRoot, hookRoot, hvRoot } from '@havue/build-utils'
import { pluginSetPackageJson, pluginTypeDefine } from '../vite-plugin'
export async function getPlugins() {
  const cwd = absCwd()
  const plugins: PluginOption[] = []
  if (cwd.startsWith(compRoot) || cwd.startsWith(directiveRoot) || cwd.startsWith(hookRoot) || cwd.startsWith(hvRoot)) {
    plugins.push(vue(), libCss())
  }
  plugins.push(await pluginSetPackageJson(), pluginTypeDefine())
  return plugins
}
