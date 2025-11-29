import { FunctionComponent } from 'react'
import {
  addTo,
  wrap,
  ModularContext,
  GetConstraintFor,
  GetValueGetterFor,
  StageParams,
  StageReturn,
} from '@modular-component/core/extend'

export function fragment<Context extends ModularContext, Field extends string>(
  field: Field,
  fragment: GetValueGetterFor<Context, Field, ReturnType<FunctionComponent>>,
) {
  return addTo<Context>().on(field).provide(wrap(fragment))
}

export type WithFragment<Context extends ModularContext> = <
  Field extends string,
>(
  ...args: StageParams<typeof fragment<Context, Field>>
) => StageReturn<typeof fragment<Context, Field>>

type Constraint<Context extends ModularContext> = GetConstraintFor<
  Context,
  'fragments',
  Record<string, ReturnType<FunctionComponent>>
>

export function fragments<
  Context extends ModularContext,
  Type extends Constraint<Context>,
>(fragments: GetValueGetterFor<Context, 'fragments', Type>) {
  return addTo<Context>().on('fragments').provide(wrap(fragments))
}

export type WithFragments<Context extends ModularContext> = <
  Type extends Constraint<Context>,
>(
  ...args: StageParams<typeof fragments<Context, Type>>
) => StageReturn<typeof fragments<Context, Type>>
