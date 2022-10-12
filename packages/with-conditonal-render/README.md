# `@modular-component/with-conditional-render`

Provides three stages that allow conditional rendering in `ModularComponent`s:

- `withCondition` will set a `condition` argument to either `true` or `false`, based
  on current arguments,
- `withConditionalFallback` takes a `FunctionComponent` as parameter, and
  renders it when the `condition` argument is set to `false`,
- `withConditionalRender` also takes a `FunctionComponent` as parameter, and
  renders it when the `condition` argument is _not_ set to `false`.

`withCondition` and `withConditionalFallback` are multiple, so it's possible
to chain multiple conditions with a different fallback for each. Subsequent calls
to `withCondition` will take into account preceding conditions, so that `withConditionalRender`
is only called when all conditions return `true`.

## Installation and usage

```bash
yarn add @modular-component/core @modular-component/with-conditional-render
```

```tsx
import { modularFactory } from '@modular-component/core'
import { WithConditionalRender } from '@modular-component/with-conditional-render'

const ModularComponent = modularFactory.extend(WithConditionalRender).build()

const MyModularComponent = ModularComponent<{
  isAuthenticated: boolean
  isOwner: boolean
}>()
  .withCondition(({ props }) => props.isAuthenticated)
  .withConditionalFallback(() => (
    <div>You need to be authenticated to see this page</div>
  ))
  .withCondition(({ props }) => props.isOwner)
  .withConditionalFallback(() => (
    <div>You don't have enough permissions to see this page</div>
  ))
  .withConditionalRender(({ components }) => (
    <>
      <h1>Hello, Owner</h1>
    </>
  ))
```

## Learn more

Read the [`ModularComponent` ReadMe](https://github.com/jvdsande/modular-component/blob/master/README.md) for more information about the `ModularComponent` system.
