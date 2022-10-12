# `@modular-component/with-default`

Sensible set of default extensions for the `ModularComponent` system.

Provides two stages:
`withLifecycle` for adding a lifecycle hook, and `withDefaultProps` for
providing default values for props.

It's also possible to import each of them individually through `@modular-component/with-lifecycle`
and `@modular-component/with-default-props` respectively.

## Installation and usage

```bash
yarn add @modular-component/core @modular-component/default
```

```tsx
import { modularFactory } from '@modular-component/core'
import { WithDefaultStages } from '@modular-component/default'

const ModularComponent = modularFactory.extend(WithDefaultStages).build()

const MyModularComponent = ModularComponent<{
  someFlag?: boolean
  someLabel: string
  someValue: number
}>()
  .withDefaultProps({ someFlag: false })
  .withLifecycle(({ props }) => {
    const [someState, setSomeState] = useState(0)

    return { someState }
  })
  .withRender(({ props, lifecycle }) => (
    <>
      <h2>
        {props.someLabel}: {props.someValue}
      </h2>
      <p>Value from state: {lifecycle.someState}</p>
      <p>Flag from props: {props.someFlag ? 'true' : 'false'}</p>
    </>
  ))
```

## Learn more

Read the [`ModularComponent` ReadMe](https://github.com/jvdsande/modular-component/blob/master/README.md) for more information about the `ModularComponent` system.
