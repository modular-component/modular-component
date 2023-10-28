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
): ModularStage<'props', (args: Args) => Merge<Props, DefaultProps>> {
  return {
    field: 'props',
    useStage: (args: Args) =>
      ({
        ...(typeof defaultProps === 'function'
          ? defaultProps(args)
          : defaultProps),
        ...args.props,
      } as Merge<Props, DefaultProps>),
  }
}
