import { createMethodRecord } from '@modular-component/core'

const withLifecycle = Symbol()

declare module '@modular-component/core' {
  export interface ModularStages<Args, Value> {
    [withLifecycle]: {
      restrict: (args: Args) => unknown
      transform: Value extends (args: Args) => infer T ? T : never
    }
  }
}

export const WithLifecycle = createMethodRecord({
  Lifecycle: {
    symbol: withLifecycle,
    field: 'lifecycle',
    transform: (args, useLifecycle) => {
      return useLifecycle(args)
    },
  },
} as const)
