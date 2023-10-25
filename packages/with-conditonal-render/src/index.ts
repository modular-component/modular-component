import React, { FunctionComponent } from 'react'
import { ModularStage } from '@modular-component/core'

export function condition<Args, Name extends string>(
  name: Name,
  useCondition: (args: Args) => boolean,
): ModularStage<Name, (args: Args) => boolean> {
  return { field: name, useStage: useCondition }
}

export function conditionalFallback<
  Args extends { [key in Name]: boolean } & {
    render?: ReturnType<FunctionComponent>
  },
  Name extends string,
>(
  name: Name,
  useRender: (args: Args) => ReturnType<FunctionComponent>,
): ModularStage<`render-${Name}`, (args: Args) => void> {
  return {
    field: `render-${name}`,
    useStage: (args: Args) => {
      args.render = !args[name] || args.render ? args.render : useRender(args)
    },
  }
}

export function conditionalRender<Args, Ref>(
  useRender: (
    args: Args,
    ref: React.ForwardedRef<Ref>,
  ) => ReturnType<FunctionComponent>,
): ModularStage<
  'render',
  (args: Args, ref: React.ForwardedRef<Ref>) => ReturnType<FunctionComponent>
> {
  return {
    field: 'render',
    useStage: (args: Args, ref: React.ForwardedRef<Ref>) =>
      (args as any).render ?? useRender(args, ref),
  }
}
