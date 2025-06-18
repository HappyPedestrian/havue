import type { SFCWithInstall } from '@havue/utils'
import { withInstall } from '@havue/utils'
import IpInput from './IpInput.vue'

export const HvIpInput: SFCWithInstall<typeof IpInput> = withInstall(IpInput)
