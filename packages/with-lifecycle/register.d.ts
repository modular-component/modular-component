import { ModularContext } from '@modular-component/core'
import { WithLifecycle } from '@modular-component/with-lifecycle'

declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withLifecycle: WithLifecycle<Context>
  }
}
