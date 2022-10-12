import { createMethodRecord } from '@modular-component/core'

export const WithDefaultProps = createMethodRecord({
  withDefaultProps: {
    field: 'props',
    transform: <A extends { props: {} }, P>(args: A, props: P) => ({
      ...(typeof props == 'function' ? props(args) : props),
      ...args.props,
    }),
    restrict: {} as Record<string, unknown>,
  },
} as const)
