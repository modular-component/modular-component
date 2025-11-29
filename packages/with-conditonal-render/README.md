# @modular-component/with-conditional-render

Provides three stages that allow conditional rendering in `ModularComponents`:

- `condition()` will set a customizable argument to either `true` or `false`, based
  on current arguments,
- `conditionalFallback()` takes a `FunctionComponent` as parameter, and
  renders it when a customizable argument is set to `true`, filling the `render` argument in the process,
- `conditionalRender()` also takes a `FunctionComponent` as parameter, and
  renders it only if the `render` argument was not filled earlier.

## Usage

**Stage function imports**

```tsx
import { ModularComponent } from '@modular-component/core'
import { lifecycle } from '@modular-component/with-lifecycle'
import {
  condition,
  conditionalFallback,
  conditionalRender,
} from '@modular-component/with-conditional-render'

const ConditionalComponent = ModularComponent<{ enabled?: boolean }>()
  .with(
    lifecycle(() => {
      // Some data fetching logic...
      return { loading, data }
    }),
  )
  .with(condition('disabled', ({ props }) => props.enabled !== true))
  .with(conditionalFallback('disabled', () => <>I'm disabled!</>))
  .with(condition('loading', ({ lifecycle }) => lifecycle.loading))
  .with(conditionalFallback('loading', () => <>I'm loading!</>))
  .with(
    conditionalRender(({ lifecycle }) => (
      <>I'm enabled and loaded, here is the content: {lifecycle.data}</>
    )),
  )
```

**Stage registration**

```tsx
import { ModularComponent } from '@modular-component/core'
import '@modular-component/with-lifecycle/register'
import '@modular-component/with-conditional-render/register'

const ConditionalComponent = ModularComponent<{ enabled?: boolean }>()
  .withLifecycle(() => {
    // Some data fetching logic...
    return { loading, data }
  })
  .withCondition('disabled', ({ props }) => props.enabled !== true)
  .withConditionalFallback('disabled', () => <>I'm disabled!</>)
  .withCondition('loading', ({ lifecycle }) => lifecycle.loading)
  .withConditionalFallback('loading', () => <>I'm loading!</>)
  .withConditionalRender(({ lifecycle }) => (
    <>I'm enabled and loaded, here is the content: {lifecycle.data}</>
  ))
```

## Multiple conditions and fallbacks

You can use the `condition` and `conditionalFallback` multiple times in the same pipeline by providing different
argument names as the first parameter.

## Stage registration

You can either automatically register the stages on `withCondition`, `withConditionalFallback` and `withConditionalRender` by importing `@modular-component/with-conditional-render/register`,
or handle the registration manually thanks to the `condition`, `conditionalFallback`, `conditionalRender` functions and `WithCondition`, `WithConditionalFallback`, `WithConditionalRender` types exports.

```ts
import { ModularComponent, ModularContext } from '@modular-component/core'
import {
  condition,
  conditionalFallback,
  conditionalRender,
  WithCondition,
  WithConditionalFallback,
  WithConditionalRender,
} from '@modular-component/with-conditional-render'

// Register the stages on the factory
ModularComponent.register({ condition, conditionalFallback, conditionalRender })

// Extend the type definition
declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withCondition: WithCondition<Context>
    withConditionalFallback: WithConditionalFallback<Context>
    withConditionalRender: WithConditionalRender<Context>
  }
}
```
