import { WithRender, ModularContext } from '@modular-component/core'

declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withRender: WithRender<Context>
  }
}
