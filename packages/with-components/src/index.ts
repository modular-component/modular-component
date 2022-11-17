import { ComponentType } from 'react'

import { createMethodRecord } from '@modular-component/core'

const withComponents = Symbol()

declare module '@modular-component/core' {
  export interface ModularStages<Args, Value> {
    [withComponents]: {
      restrict: Record<string, ComponentType>
    }
  }
}

export const WithComponents = createMethodRecord({
  Components: { symbol: withComponents, field: 'components' },
} as const)
