# @modular-component/with-default-props

Provides a `with(defaultProps)` stage allowing to set default value for props. Contrary to the standard React `defaultProps`
field, the `with(defaultProps)` stage can also _set new props_ that are not surfaced by the component, and react to passed
props (or other previous stages) to dynamically compute a default value.

## Usage

```tsx
import { ModularComponent } from '@modular-component/core'
import { defaultProps } from '@modular-component/with-default-props'

const MyComponent = ModularComponent<{ someFlag?: boolean }>()
  .with(defaultProps({
    someFlag: false,
    someNewProp: 'hello world'
  }))
  .with(render(({ props }) => (
    // props is inferred as { someFlag: boolean; someNewProp: string } at this point
  )))

const MyDynamicProps = ModularComponent<{ 
  role: 'user' | 'owner' | 'admin', 
  canEdit?: boolean, 
  canDelete?: boolean 
}>()
  .with(defaultProps(({ props }) => ({
    canEdit: ['owner', 'admin'].includes(props.role),
    canDelete: ['owner'].includes(props.role)
  }))
  .with(render(({ props }) => {
    // props is inferred as { role: 'user' | 'owner' | 'admin'; canEdit: boolean; canDelete: boolean }
    // canEdit defaults to true if the role is not "user", false otherwise
    // canDelete defaults to true if the role is "admin", false otherwise
    // canEdit and canDelete can still be controlled by explicitely setting the property
  })))
```

## Implementation

`with(defaultProps)` runs a custom stage hook to shallowly merge the default props to the received component props.
Accepted values are restricted to a partial map of the original props to only accept correct types for defined props.
The value can also be a function of the current args.

```tsx
import { ModularStage } from '@modular-component/core'

type Merge<Props, DefaultProps extends Partial<Props>> = {
  [key in keyof Props | keyof DefaultProps]-?: key extends keyof Props
    ? key extends keyof DefaultProps
      ? NonNullable<Props[key]>
      : Props[key]
    : DefaultProps[key]
}

export function defaultProps<
  Args extends { props: {} },
  Props extends Args extends { props: infer U } ? U : {},
  DefaultProps extends Partial<Props>,
>(
  defaultProps: DefaultProps | ((args: Args) => DefaultProps),
): ModularStage<
  'props',
  (args: Args) => Merge<Props, DefaultProps>
> {
  return {
    field: 'props',
    useStage: (args: Args) =>
      ({
        ...(typeof defaultProps === 'function' ? defaultProps(args) : defaultProps),
        ...args.props,
      } as Merge<Props, DefaultProps>),
  }
}
```
