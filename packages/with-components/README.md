# @modular-component/with-components

Provides a `with(components)` stage that fills the `components` argument with
a map of React components. Useful when running tests in an environment that
does not allow module mocking: sub-components can be stubbed in tests by
mocking the stage to replace their implementations.

## Usage

```tsx
import { ModularComponent } from '@modular-component/core'
import { components } from '@modular-component/with-components'

import { SomeComponent } from 'some-component'

const MyComponent = ModularComponent()
  .with(components({ SomeComponent }))
  .with(render(({ props, components }) => <components.SomeComponent />))
```

## Replacing sub-components

Replacing sub-components can be done either by updating or mocking the stage.
It allows creating a clone of the component with a different sub-component implementation,
either for tests or for content.
For instance, one could imagine a `Layout` base component taking advantage of this functionality:

```tsx
const PageLayout = ModularComponent()
  .with(components({
    Title: React.Fragment,
    Subtitle: React.Fragment,
    Content: React.Fragment,
    Footer: React.Fragment
  }))
  .with(render(({ components }) => (
    // Build a layout using <components.Title />, <components.Subtitle />...
  )))

const PageOne = PageLayout.with(components({
  Title: () => <>First page</>,
  Subtitle: () => <>I have a subtitle but no footer</>,
  Content: () => <>First page content</>,
  Footer: React.Fragment
}))

const PageTwo = PageLayout.with(components({
  Title: () => <>Second page</>,
  Subtitle: React.Fragment,
  Content: () => <>Second page content</>,
  Footer: () => <>I have a footer but no subtitle</>
}))
```

## Implementation

`with(components)` is a simple stage adding the provided record as a `components` argument. It has a restriction
on accepted values, to only accept a record of React components.

```tsx
import { ComponentType } from 'react'
import { ModularStage } from '@modular-component/core'

export function components<Components extends Record<string, ComponentType>>(
  components: Components,
): ModularStage<'components', () => Components> {
  return { field: 'components', useStage: () => components }
}
```
