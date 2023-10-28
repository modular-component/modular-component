
# @modular-component/with-lifecycle

Basic stage allowing to save the result of a custom hook to a `lifecycle` argument passed down to further stages.
The lifecycle hook receives the previous argument map as parameter, and can therefore use props or any other
injected argument.

## Usage

```tsx
import { ModularComponent } from '@modular-component/core'
import { lifecycle } from '@modular-component/with-lifecycle'

const MyComponent = ModularComponent()
  .with(lifecycle(({ props }) => {
    // Write component state & logic here
  }))
  .with(render(({ props, lifecycle }) => (
    // Use computed lifecycle in the render phase
  )))
```

## Implementation

`with(lifecycle)` receives a function taking the current arguments map as parameter. It uses this function as the
stage hook directly:

```ts
import { ModularStage } from '@modular-component/core'

export function lifecycle<Args extends {}, Return>(
  useLifecycle: (args: Args) => Return,
): ModularStage<'lifecycle', (args: Args) => Return> {
  return { field: 'lifecycle', useStage: useLifecycle }
}
```
