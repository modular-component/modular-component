# @modular-component/core

Core system for creating Modular components. Exports the `ModularComponent` factory function, as well as
helpers for creating stages.

## Installation and usage

```bash
yarn add @modular-component/core
```

```tsx
// Usage in apps
import { ModularComponent, render } from '@modular-component/core'

const MyComponent = ModularComponent().with(
  render(() => <div>Hello Modular!</div>),
)
```

```tsx
// Or by extending the factory
import { ModularComponent } from '@modular-component/core'
import '@modular-component/core/register'

const MyComponent = ModularComponent().withRender(() => (
  <div>Hello Modular!</div>
))
```

```tsx
// Usage in extensions
import { ModularContext, addTo } from '@modular-component/core/extend'

export function extension<Context extends ModularContext>() {
  return addTo<Context>()
    .on('field')
    .provide((args) => {
      // Compute value for argument 'field' from previous stage arguments
    })
}
```

## Learn more

Read the [`ModularComponent` ReadMe](https://github.com/modular-component/modular-component/blob/master/README.md) for more information about the `ModularComponent` system.
