import installer from './defaults'
export * from '@pedy/shared'
export * from '@pedy/components'
export * from '@pedy/solutions'
export * from '@pedy/directives'
export * from '@pedy/hooks'
export * from '@pedy/tools'
export * from './make-installer'

export const install = installer.install
// export const version = installer.version
export default installer
