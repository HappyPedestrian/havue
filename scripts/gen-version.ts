import type { PackageJson } from 'type-fest'
import { writeFile } from 'fs/promises'
import path, { resolve } from 'path'
import { consola } from 'consola'
import fg from 'fast-glob'
import 'dotenv/config'
import { pkgRoot, hvRoot, readJsonFile, writeJsonFile } from '@havue/build-utils'
import pkg from '../packages/havue/package.json' // need to be checked

function getVersion() {
  const tagVer = process.env.TAG_VERSION
  if (tagVer) {
    return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
  } else {
    return pkg.version
  }
}

const version = getVersion()

async function main() {
  consola.info(`Version: ${version}`)
  await writeFile(path.resolve(hvRoot, 'src', 'version.ts'), `export const version = '${version}'\n`)

  const pkgPaths = fg.sync('**/package.json', {
    cwd: pkgRoot,
    ignore: ['**/node_modules', 'dist']
  })

  const task: Array<Promise<void>> = []

  const fn = async (path: string) => {
    const packageJson = await readJsonFile<PackageJson>(path)
    packageJson.version = version

    await writeJsonFile(path, packageJson, null, 2)
  }

  pkgPaths.forEach(async (path) => {
    const pkgPath = resolve(pkgRoot, path)
    task.push(fn(pkgPath))
  })

  await Promise.all(task)
}

main()
