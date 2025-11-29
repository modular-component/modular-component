# @modular-component/with-fragment

ModularComponent stage allowing to cut the render phase into multiple fragments that can be composed together in the
render stage. It can make conditional rendering easier to read and reduce duplication.

It can either return a map of React node accessible through the `fragments` field, or be called multiple times by
specifying a field key to use and returning a single React node.

## Usage

**Stage function imports**

```tsx
import { ModularComponent, render } from '@modular-component/core'
import { fragment, fragments } from '@modular-component/with-fragment'

// Through multiple calls
const MultipleCalls = ModularComponent<{ loading: boolean }>()
  .with(fragment('loading', <div>Loading...</div>))
  .with(fragment('loaded', <div>Loaded</div>))
  .with(
    render(({ props, loading, loaded }) => (
      <div>Current status: {props.loading ? loading : loaded}</div>
    )),
  )

// Through a single call
const SingleCall = ModularComponent<{ loading: boolean }>()
  .with(
    fragments({
      loading: <div>Loading...</div>,
      loaded: <div>Loaded</div>,
    }),
  )
  .with(
    render(({ props, fragments }) => (
      <div>
        Current status: {props.loading ? fragments.loading : fragments.loaded}
      </div>
    )),
  )
```

**Stage registration**

```tsx
import { ModularComponent } from '@modular-component/core'
import '@modular-component/core/register'
import '@modular-component/with-fragment/register'

// Through multiple calls
const MultipleCalls = ModularComponent<{ loading: boolean }>()
  .withFragment('loading', <div>Loading...</div>)
  .withFragment('loaded', <div>Loaded</div>)
  .withRender(({ props, loading, loaded }) => (
    <div>Current status: {props.loading ? loading : loaded}</div>
  ))

// Through a single call
const SingleCall = ModularComponent<{ loading: boolean }>()
  .withFragments({
    loading: <div>Loading...</div>,
    loaded: <div>Loaded</div>,
  })
  .withRender(({ props, fragments }) => (
    <div>
      Current status: {props.loading ? fragments.loading : fragments.loaded}
    </div>
  ))
```

## Reacting to previous stages

The fragment argument can either be a JSX fragment, or a function
receiving the previous stages arguments and returning a JSX fragment:

```tsx
const UserCard = ModularComponent<{
  firstName: string
  lastName: string
  email: string
}>()
  .withFragment('name', ({ props }) => (
    <p>
      {props.firstName} {props.lastName}
    </p>
  ))
  .withFragment('email', ({ props }) => <p>{props.email}</p>)
  .withRender(({ name, email }) => (
    <article>
      {name}
      {email}
    </article>
  ))
```

## Stage registration

You can either automatically register the stages on `withFragment` and `withFragments` by importing `@modular-component/with-fragment/register`,
or handle the registration manually thanks to the `fragment` and `fragments` functions, and `WithFragment` and `WithFragments` type exports.

```ts
import { ModularComponent, ModularContext } from '@modular-component/core'
import {
  fragment,
  fragments,
  WithFragment,
  WithFragments,
} from '@modular-component/with-fragment'

// Register the stages on the factory
ModularComponent.register({ fragment, fragments })

// Extend the type definition
declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withFragment: WithFragment<Context>
    withFragments: WithFragment<Context>
  }
}
```
