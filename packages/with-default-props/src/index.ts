import {
  addTo,
  wrap,
  ModularContext,
  GetConstraintFor,
  GetValueGetterFor,
  StageParams,
  StageReturn,
} from '@modular-component/core/extend'

type NonNullableFields<Type> = {
  [key in keyof Type]-?: undefined extends Type[key] ? never : key
}[keyof Type]
type NullableFields<Type> = {
  [key in keyof Type]: undefined extends Type[key] ? key : never
}[keyof Type]
type OptionalNullable<Type> = {
  [key in NonNullableFields<Type>]: Type[key]
} & {
  [key in NullableFields<Type>]?: Type[key]
}

type Merge<Props, DefaultProps extends Partial<Props>> = OptionalNullable<{
  [key in keyof Props | keyof DefaultProps]-?: key extends keyof Props
    ? key extends keyof DefaultProps
      ? Props[key] extends undefined | infer U
        ? U
        : Props[key]
      : Props[key]
    : DefaultProps[key]
}> extends infer U
  ? { [key in keyof U]: U[key] }
  : never

type OnlyRequiredInConstraint<Original, Constraint> = {
  [key in keyof Constraint & keyof Original]: undefined extends Original[key]
    ? undefined extends Constraint[key]
      ? never
      : key
    : never
}[keyof Constraint & keyof Original]

type Constraint<Context extends ModularContext> = Partial<Context['props']> &
  Pick<
    GetConstraintFor<Context, 'props'>,
    OnlyRequiredInConstraint<
      Context['props'],
      GetConstraintFor<Context, 'props'>
    >
  > extends infer U
  ? { [key in keyof U]: U[key] }
  : never

export function defaultProps<
  Context extends ModularContext,
  Default extends Constraint<Context>,
>(useDefault: GetValueGetterFor<Context, 'props', Default>) {
  return addTo<Context>()
    .on('props')
    .provide((args): Merge<Context['props'], Default> => {
      const defaultProps = wrap(useDefault)(args)
      const merged = {
        ...(args as { props: Context['props'] }).props
      }

      Object.entries(defaultProps).forEach(([prop, value]) => {
        if (merged[prop] === undefined) {
          merged[prop] = value
        }
      })

      return merged
    })
}

export type WithDefaultProps<Context extends ModularContext> = <
  Default extends Constraint<Context>,
>(
  ...args: StageParams<typeof defaultProps<Context, Default>>
) => StageReturn<typeof defaultProps<Context, Default>>
