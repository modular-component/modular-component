import { ModularContext } from '@modular-component/core'
import {
  WithCondition,
  WithConditionalFallback,
  WithConditionalRender,
} from '@modular-component/with-conditional-render'

declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withCondition: WithCondition<Context>
    withConditionalFallback: WithConditionalFallback<Context>
    withConditionalRender: WithConditionalRender<Context>
  }
}
