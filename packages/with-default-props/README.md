# @modular-component/with-default-props

Provides a `defaultProps()` stage allowing to set default value for props. Contrary to the standard React `defaultProps`
field, the `defaultProps()` stage can also _set new props_ that are not surfaced by the component, and react to passed
props (or other previous stages) to dynamically compute a default value.

## Usage

**Stage function imports**

```tsx
import { ModularComponent, render } from '@modular-component/core'
import { defaultProps } from '@modular-component/with-default-props'

const MyComponent = ModularComponent<{ someFlag?: boolean }>()
  .with(
    defaultProps({
      someFlag: false,
      someNewProp: 'hello world',
    }),
  )
  .with(
    render(({ props }) => {
      // props is inferred as { someFlag: boolean; someNewProp: string } at this point
    }),
  )

const MyDynamicProps = ModularComponent<{
  role: 'user' | 'owner' | 'admin'
  canEdit?: boolean
  canDelete?: boolean
}>()
  .with(
    defaultProps(({ props }) => ({
      canEdit: ['owner', 'admin'].includes(props.role),
      canDelete: ['owner'].includes(props.role),
    })),
  )
  .with(
    render(({ props }) => {
      // props is inferred as { role: 'user' | 'owner' | 'admin'; canEdit: boolean; canDelete: boolean }
      // canEdit defaults to true if the role is not "user", false otherwise
      // canDelete defaults to true if the role is "admin", false otherwise
      // canEdit and canDelete can still be controlled by explicitely setting the property
    }),
  )
```

**Stage registration**

```tsx
import { ModularComponent } from '@modular-component/core'
import '@modular-component/core/register'
import '@modular-component/with-default-props/register'

const MyComponent = ModularComponent<{ someFlag?: boolean }>()
  .withDefaultProps({
    someFlag: false,
    someNewProp: 'hello world',
  })
  .withRender(({ props }) => {
    // props is inferred as { someFlag: boolean; someNewProp: string } at this point
  })

const MyDynamicProps = ModularComponent<{
  role: 'user' | 'owner' | 'admin'
  canEdit?: boolean
  canDelete?: boolean
}>()
  .withDefaultProps(({ props }) => ({
    canEdit: ['owner', 'admin'].includes(props.role),
    canDelete: ['owner'].includes(props.role),
  }))
  .withRender(({ props }) => {
    // props is inferred as { role: 'user' | 'owner' | 'admin'; canEdit: boolean; canDelete: boolean }
    // canEdit defaults to true if the role is not "user", false otherwise
    // canDelete defaults to true if the role is "admin", false otherwise
    // canEdit and canDelete can still be controlled by explicitely setting the property
  })
```

## Stage registration

You can either automatically register the stage on `withDefaultProps` by importing `@modular-component/with-default-props/register`,
or handle the registration manually thanks to the `defaultProps` function and `WithDefaultProps` type exports.

```ts
import { ModularComponent, ModularContext } from '@modular-component/core'
import {
  defaultProps,
  WithDefaultProps,
} from '@modular-component/with-default-props'

// Register the stage on the factory
ModularComponent.register({ defaultProps })

// Extend the type definition
declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withDefaultProps: WithDefaultProps<Context>
  }
}
```
