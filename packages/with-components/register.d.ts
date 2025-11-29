import { ModularContext } from '@modular-component/core'
import { WithComponents } from '@modular-component/with-components'

declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withComponents: WithComponents<Context>
  }
}
