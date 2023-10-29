# @modular-component/with-fragment

ModularComponent stage allowing to cut the render phase into multiple fragments that can be composed together in the
render stage. It can make conditional rendering easier to read and reduce duplication.

It can either return a map of React node accessible through the `fragments` field, or be called multiple times by
specifying a field key to use and returning a single React node.

## Usage

```tsx
import { ModularComponent, render } from '@modular-component/core'
import { fragment } from '@modular-component/with-fragment'

// Through multiple calls
const MultipleCalls = ModularComponent<{ loading: boolean }>()
  .with(fragment('loading', () => <div>Loading...</div>))
  .with(fragment('loaded', () => <div>Loaded</div>))
  .with(render(({ props, loading, loaded }) => (
    <div>Current status: {props.loading ? loading : loaded}</div>
  )))

// Through a single call
const SingleCall = ModularComponent<{ loading: boolean }>()
  .with(fragment(() => ({
    loading: <div>Loading...</div>,
    loaded: <div>Loaded</div>,
  }))
  .with(render(({ props, fragments }) => (
    <div>Current status: {props.loading ? fragments.loading : fragments.loaded}</div>
  ))))
```

## Implementation

`with(fragment)` receives a function taking the current arguments map as parameter and returns either a map of React node
or a single React node, to set as stage function, and optionally a key to be used as the field.

```ts
import { ReactNode } from 'react'
import { ModularStage } from '@modular-component/core'

export function fragment<
  Args extends {},
  Fragments extends Record<string, ReactNode>,
>(
  useFragment: (args: Args) => Fragments,
): ModularStage<'fragments', (args: Args) => Fragments>
export function fragment<
  Args extends {},
  Fragment extends ReactNode,
  Key extends string,
>(
  key: Key,
  useFragment: (args: Args) => Fragment,
): ModularStage<Key, (args: Args) => Fragment>

export function fragment<Key extends string, Stage extends () => unknown>(
  key: Key | Stage,
  useFragment?: Stage,
): ModularStage<Key, Stage> {
  return {
    field: (typeof key === 'string' ? key : 'fragments') as Key,
    useStage: (typeof key === 'string' ? useFragment : key) as Stage,
  }
}
```
