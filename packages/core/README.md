# @modular-component/core

Core system for creating a `ModularComponent` factory. Exports the `modularFactory`
builder, and necessary types for creating extensions.

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
// Usage in extensions
import { ModularStage } from '@modular-component/core'

export function extension(): ModularStage<'field', () => void> {
  return { field: 'field', useStage: () => {} }
}
```

## Learn more

Read the [`ModularComponent` ReadMe](https://github.com/jvdsande/modular-component/blob/master/README.md) for more information about the `ModularComponent` system.
