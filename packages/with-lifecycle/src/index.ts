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
  'lifecycle',
  {}
>

export function lifecycle<
  Context extends ModularContext,
  Type extends Constraint<Context>,
>(useLifecycle: GetValueGetterFor<Context, 'lifecycle', Type>) {
  return addTo<Context>().on('lifecycle').provide(wrap(useLifecycle))
}

export type WithLifecycle<Context extends ModularContext> = <
  Type extends Constraint<Context>,
>(
  ...args: StageParams<typeof lifecycle<Context, Type>>
) => StageReturn<typeof lifecycle<Context, Type>>
