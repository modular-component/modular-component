import { modularFactory } from '@modular-component/core'

import { WithDefaultStages } from '@modular-component/default'
import { WithComponents } from '@modular-component/with-components'
import { WithConditionalRender } from '@modular-component/with-conditional-render'

const withDate = Symbol()

export const ModularComponent = modularFactory
  .extend(WithDefaultStages)
  .extend(WithComponents)
  .extend(WithConditionalRender)
  .extend({
    withDate: {
      field: 'date',
      symbol: withDate,
      transform: () => new Date(),
      restrict: undefined,
    },
    withDebug: {
      field: 'debug',
      multiple: true,
      restrict: undefined,
      transform: (args, useDebug) => {
        if (typeof useDebug === 'function') {
          useDebug(args)
        } else {
          console.log(args)
        }
      },
    },
  } as const)
  .build()

declare module '@modular-component/core' {
  export interface ModularStageTransform<T> {
    [withDate]: Date
  }
}
