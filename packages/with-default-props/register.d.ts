import { ModularContext } from '@modular-component/core'
import { WithDefaultProps } from '@modular-component/with-default-props'

declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withDefaultProps: WithDefaultProps<Context>
  }
}
