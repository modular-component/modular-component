import { ComponentType } from 'react'
import {
  addTo,
  wrap,
  ModularContext,
  GetConstraintFor,
  GetValueGetterFor,
  StageParams,
  StageReturn,
} from '@modular-component/core/extend'

type Constraint<Context extends ModularContext> = GetConstraintFor<
  Context,
  'components',
  Record<string, ComponentType<any>>
>

export function components<
  Context extends ModularContext,
  Type extends Constraint<Context>,
>(components: GetValueGetterFor<Context, 'components', Type>) {
  return addTo<Context>().on('components').provide(wrap(components))
}

export type WithComponents<Context extends ModularContext> = <
  Type extends Constraint<Context>,
>(
  ...args: StageParams<typeof components<Context, Type>>
) => StageReturn<typeof components<Context, Type>>
