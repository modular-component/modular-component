# `@modular-component/with-lifecycle`

Provides a `withLifecycle` stage allowing to define a lifecycle hook,
thus keeping all component logic isolated from the render phase.

Also useful for tests, as the lifecycle and render phases can be tested
in isolation.

## Installation and usage

```bash
yarn add @modular-component/core @modular-component/with-lifecycle
```

```tsx
import { useState } from 'react'

import { modularFactory } from '@modular-component/core'
import { WithLifecycle } from '@modular-component/with-lifecycle'

const ModularComponent = modularFactory.extend(WithLifecycle).build()

const MyModularComponent = ModularComponent()
  .withLifecycle(() => {
    const [count, setCount] = useState(0)

    const increment = () => setCount((c) => c + 1)
    const decrement = () => setCount((c) => c - 1)

    return {
      count,
      increment,
      decrement,
    }
  })
  .withRender(({ lifecycle }) => (
    <>
      <pre>Count: {count}</pre>
      <button onClick={lifecycle.increment}>Increment</button>
      <button onClick={lifecycle.decrement}>Decrement</button>
    </>
  ))
```

```tsx
// Usage in tests

// Test the lifecycle
const useMyModularLifecycle =
  MyModularComponent.atStage('withLifecycle').asHook('lifecycle')

const result = renderHook(useMyModularLifecycle)

expect(result.count).toEqual(0)
act(result.increment)
expect(result.count).toEqual(1)
act(result.decrement)
act(result.decrement)
exepct(result.count).toEqual(-1)

// Test the render
const mockIncrement = someMock()
const mockDecrement = someMock()

const TestMyModularRender = MyModularComponent.withLifecycle({
  count: 42,
  increment: mockIncrement,
  decrement: mockDecrement,
})

render(<TestMyModularRender />)

expect(getByText('Count: 42')).toBeInTheDocument()

userEvent.click(getByText('Increment'))
expect(mockIncrement).toHaveBeenCalled()

userEvent.click(getByText('Decrement'))
expect(mockDecrement).toHaveBeenCalled()
```

## Learn more

Read the [`ModularComponent` ReadMe](https://github.com/jvdsande/modular-component/blob/master/README.md) for more information about the `ModularComponent` system.
