# @modular-component/with-components

Provides a `components()` stage that fills the `components` argument with
a map of React components. Useful when running tests in an environment that
does not allow module mocking: sub-components can be stubbed in tests by
mocking the stage to replace their implementations.

## Usage

**Stage function imports**

```tsx
import { ModularComponent, render } from '@modular-component/core'
import { components } from '@modular-component/with-components'

import { SomeComponent } from 'some-component'

const MyComponent = ModularComponent()
  .with(components({ SomeComponent }))
  .with(render(({ props, components }) => <components.SomeComponent />))
```

**Stage registration**

```tsx
import { ModularComponent } from '@modular-component/core'
import '@modular-component/core/register'
import '@modular-component/with-components/register'

import { SomeComponent } from 'some-component'

const MyComponent = ModularComponent()
  .withComponents({ SomeComponent })
  .withRender(({ props, components }) => <components.SomeComponent />)
```

## Replacing sub-components

Replacing sub-components can be done either by updating or mocking the stage.
It allows creating a clone of the component with a different sub-components implementation,
either for tests or for content.
For instance, one could imagine a `Layout` base component taking advantage of this functionality:

```tsx
const PageLayout = ModularComponent()
  .withComponents({
    Title: React.Fragment,
    Subtitle: React.Fragment,
    Content: React.Fragment,
    Footer: React.Fragment,
  })
  .withRender(({ components }) => {
    // Build a layout using <components.Title />, <components.Subtitle />...
  })

const PageOne = PageLayout.withComponents({
  Title: () => <>First page</>,
  Subtitle: () => <>I have a subtitle but no footer</>,
  Content: () => <>First page content</>,
  Footer: React.Fragment,
})

const PageTwo = PageLayout.withComponents({
  Title: () => <>Second page</>,
  Subtitle: React.Fragment,
  Content: () => <>Second page content</>,
  Footer: () => <>I have a footer but no subtitle</>,
})
```

## Stage registration

You can either automatically register the stage on `withComponents` by importing `@modular-component/with-components/register`,
or handle the registration manually thanks to the `components` function and `WithComponents` type exports.

For instance, here is how you could register it on `withSubComponents` instead:

```ts
import { ModularComponent, ModularContext } from '@modular-component/core'
import { components, WithComponents } from '@modular-component/with-components'

// Register the stage on the factory
ModularComponent.register({ subComponents: components })

// Extend the type definition
declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withSubComponents: WithComponents<Context>
  }
}
```
