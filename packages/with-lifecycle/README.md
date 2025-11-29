# @modular-component/with-lifecycle

Basic stage allowing to save the result of a custom hook to a `lifecycle` argument passed down to further stages.
The lifecycle hook receives the previous argument map as parameter, and can therefore use props or any other
injected argument.

## Usage

**Stage function imports**

```tsx
import { ModularComponent, render } from '@modular-component/core'
import { lifecycle } from '@modular-component/with-lifecycle'

const MyComponent = ModularComponent()
  .with(
    lifecycle(({ props }) => {
      // Write component state & logic here
    }),
  )
  .with(
    render(({ props, lifecycle }) => {
      // Use computed lifecycle in the render phase
    }),
  )
```

**Stage registration**

```tsx
import { ModularComponent } from '@modular-component/core'
import '@modular-component/core/register'
import '@modular-component/with-lifecycle/register'

const MyComponent = ModularComponent()
  .withLifecycle(({ props }) => {
    // Write component state & logic here
  })
  .withRender(({ props, lifecycle }) => {
    // Use computed lifecycle in the render phase
  })
```

## Stage registration

You can either automatically register the stage on `withLifecycle` by importing `@modular-component/with-lifecycle/register`,
or handle the registration manually thanks to the `lifecycle` function and `WithLifecycle` type exports.

For instance, here is how you could register it on `withLogic` instead:

```ts
import { ModularComponent, ModularContext } from '@modular-component/core'
import { lifecycle, WithLifecycle } from '@modular-component/with-lifecycle'

// Register the stage on the factory
ModularComponent.register({ logic: lifecycle })

// Extend the type definition
declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withLogic: WithLifecycle<Context>
  }
}
```
