import { createMethodRecord } from '@modular-component/core'

import { ComponentType } from 'react'

export const WithComponents = createMethodRecord({
  withComponents: {
    field: 'components',
    restrict: {} as Record<string, ComponentType<any>>,
  },
} as const)
