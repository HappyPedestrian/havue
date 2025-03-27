import installer from './defaults'
export * from '@havue/shared'
export * from '@havue/components'
export * from '@havue/solutions'
export * from '@havue/directives'
export * from '@havue/hooks'
export * from '@havue/tools'
export * from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer
