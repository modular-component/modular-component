# `@modular-component/with-default-props`

Provides a `withDefaultProps` stage providing default values for props.

Correctly updates typing of `props` argument to mark props with default
values as non-nullable.

## Installation and usage

```bash
yarn add @modular-component/core @modular-component/with-default-props
```

```tsx
import { modularFactory } from '@modular-component/core'
import { WithDefaultProps } from '@modular-component/with-default-props'

const ModularComponent = modularFactory.extend(WithDefaultProps).build()

const MyModularComponent = ModularComponent<{
  content?: {
    title: string
    subtitle: string
  }
}>()
  .withDefaultProps({
    content: {
      title: 'Default title',
      subtitle: 'Default subtitle',
    },
  })
  .withRender(({ props }) => (
    <>
      <h1>{props.content.title}</h1>
      <h2>{props.content.subtitle}</h2>
    </>
  ))
```

## Learn more

Read the [`ModularComponent` ReadMe](https://github.com/jvdsande/modular-component/blob/master/README.md) for more information about the `ModularComponent` system.
