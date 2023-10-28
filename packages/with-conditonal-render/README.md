# @modular-component/with-conditional-render

Provides three stages that allow conditional rendering in `ModularComponent`s:

- `with(condition)` will set a customizable argument to either `true` or `false`, based
  on current arguments,
- `with(conditionalFallback)` takes a `FunctionComponent` as parameter, and
  renders it when a customizable argument is set to `true`, filling the `render` argument in the process,
- `with(conditionalRender)` also takes a `FunctionComponent` as parameter, and
  renders it if the `render` argument was not filled earlier.

## Usage

```tsx
import { ModularComponent } from '@modular-component/core'
import { condition, conditionalFallback, conditionalRender } from '@modular-component/with-conditional-render'

const ConditionalComponent = ModularComponent<{ enabled?: boolean }>()
  .with(condition('disabled', ({ props }) => props.enabled !== true))
  .with(conditionalFallback('disabled', () => <>I'm disabled!</>))
  .with(lifecycle(() => {
    // Some data fetching logic...
    return { loading, data }
  }))
  .with(condition('loading', ({ lifecycle }) => lifecycle.loading === false))
  .with(conditionalFallback('loading', () => <>I'm loading!</>))
  .with(conditionalRender(({ lifecycle }) => (
    <>I'm enabled and loaded, here is the content: {lifecycle.data}</>
  )))
```

## Multiple conditions and fallbacks

You can use the `condition` and `conditionalFallback` multiple times in the same pipeline by providing different
argument names as the first parameter.

## Implementation

The implementation for those stages is a bit more involved than other official extensions. Here, we have restrictions
for each stage, as well as stage hooks.

```tsx
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
```
