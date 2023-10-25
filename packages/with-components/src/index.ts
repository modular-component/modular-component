import { ComponentType } from 'react'
import { ModularStage } from '@modular-component/core'

export function components<Components extends Record<string, ComponentType>>(
  components: Components,
): ModularStage<'components', () => Components> {
  return { field: 'components', useStage: () => components }
}
