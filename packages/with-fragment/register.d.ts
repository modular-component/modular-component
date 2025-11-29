import { ModularContext } from '@modular-component/core'
import { WithFragment, WithFragments } from '@modular-component/with-fragment'

declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withFragment: WithFragment<Context>
    withFragments: WithFragments<Context>
  }
}
