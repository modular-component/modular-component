import { FunctionComponent } from 'react'
import {
  addTo,
  wrap,
  ModularContext,
  GetValueGetterFor,
  StageParams,
  StageReturn,
} from '@modular-component/core/extend'

type GetConditions<Context extends ModularContext> = {
  [key in keyof Context['arguments']]: Context['arguments'][key] extends boolean
    ? key extends string
      ? key
      : never
    : never
}[keyof Context['arguments']]

export function condition<Context extends ModularContext, Field extends string>(
  field: Field,
  useCondition: GetValueGetterFor<Context, Field, boolean>,
) {
  return addTo<Context>().on(field).provide(wrap(useCondition))
}

export type WithCondition<Context extends ModularContext> = <
  Field extends string,
>(
  ...args: StageParams<typeof condition<Context, Field>>
) => StageReturn<typeof condition<Context, Field>>

export function conditionalFallback<
  Context extends ModularContext,
  Condition extends GetConditions<Context>,
>(
  condition: Condition,
  useRender: GetValueGetterFor<
    Context,
    `render-${Condition}`,
    ReturnType<FunctionComponent>
  >,
) {
  return addTo<Context>()
    .on(`render-${condition}`)
    .provide((args) => {
      const _args = args as {
        [condition]?: boolean
        render?: ReturnType<FunctionComponent>
      }
      if (_args[condition] && !_args.render) {
        _args.render = wrap(useRender)(args)
      }
      return !!_args[condition]
    })
}

export type WithConditionalFallback<Context extends ModularContext> = <
  Condition extends GetConditions<Context>,
>(
  ...args: StageParams<typeof conditionalFallback<Context, Condition>>
) => StageReturn<typeof conditionalFallback<Context, Condition>>

export function conditionalRender<Context extends ModularContext>(
  useRender: GetValueGetterFor<
    Context,
    'render',
    ReturnType<FunctionComponent>
  >,
) {
  return addTo<Context>()
    .on('render')
    .provide(
      (args): ReturnType<FunctionComponent> =>
        (args as { render?: ReturnType<FunctionComponent> }).render ??
        wrap(useRender)(args),
    )
}

export type WithConditionalRender<Context extends ModularContext> = (
  ...args: StageParams<typeof conditionalRender<Context>>
) => StageReturn<typeof conditionalRender<Context>>
