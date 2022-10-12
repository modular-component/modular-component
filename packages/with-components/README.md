# `@modular-component/with-components`

Provides a `withComponents` stage that fills the `components` argument with
a map of React components. Useful when running tests in an environment that
does not allow module mocking: sub-components can be stubbed in tests by
calling the stage again to replace their implementations.

## Installation and usage

```bash
yarn add @modular-component/core @modular-component/with-components
```

```tsx
// Usage in apps
import { modularFactory } from '@modular-component/core'
import { WithComponents } from '@modular-component/with-components'

const ModularComponent = modularFactory.extend(WithComponents).build()

const MyModularComponent = ModularComponent()
  .withComponents({
    SubComponent: () => <h2>Subtitle</h2>,
  })
  .withRender(({ components }) => (
    <>
      <h1>Main Title</h1>
      <components.SubComponent />
    </>
  ))
```

```tsx
// Usage in tests

const SubComponentMock = someMock()
const TestMyModularComponent = MyModularComponent.withComponents({
  SubComponent: SubComponentMock,
})

render(<TestMyModularComponent />)

expect(someMock).toHaveBeenCalledOnce()
```

## Learn more

Read the [`ModularComponent` ReadMe](https://github.com/jvdsande/modular-component/blob/master/README.md) for more information about the `ModularComponent` system.
