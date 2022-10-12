# `@modular-component/core`

Core system for creating a `ModularComponent` factory. Exports the `modularFactory`
builder, and necessary types for creating extensions.

## Installation and usage

```bash
yarn add @modular-component/core
```

```tsx
// Usage in apps
import { modularFactory } from '@modular-component/core'

const ModularComponent = modularFactory.build()

const MyComponent = ModularComponent().withRender(() => (
  <div>Hello Modular!</div>
))
```

```tsx
// Usage in extensions
import { createMethodRecord } from '@modular-component/core'

export const WithExtension = createMethodRecord({
  field: 'extension',
} as const)
```

## Learn more

Read the [`ModularComponent` ReadMe](https://github.com/jvdsande/modular-component/blob/master/README.md) for more information about the `ModularComponent` system.
