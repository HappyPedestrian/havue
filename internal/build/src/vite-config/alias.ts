import type { Alias } from 'vite'
import type { PackageJson } from 'type-fest'
import fg from 'fast-glob'
import { resolve, dirname } from 'node:path'
import { pkgRoot, readJsonFileSync } from '@havue/build-utils'

export function getAlias(): Alias[] {
  const pkgPaths = fg.sync('**/package.json', {
    cwd: pkgRoot,
    ignore: ['**/node_modules', 'dist']
  })
  const aliasList: Alias[] = []

  pkgPaths.forEach((path) => {
    const pkgPath = resolve(pkgRoot, path)
    const packageJson = readJsonFileSync<PackageJson>(pkgPath)

    const name = packageJson.name
    name &&
      aliasList.push({
        find: name,
        replacement: resolve(dirname(pkgPath), 'src')
      })
  })

  return aliasList
}
