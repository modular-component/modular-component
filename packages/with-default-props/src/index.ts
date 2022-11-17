import { createMethodRecord } from '@modular-component/core'

const withDefaultProps = Symbol()

declare module '@modular-component/core' {
  export interface ModularStages<Args, Value> {
    [withDefaultProps]: {
      restrict:
        | Partial<Args extends { props: infer P } ? P : {}>
        | ((args: Args) => Partial<Args extends { props: infer P } ? P : {}>)
      transform: Value extends ((args: Args) => infer T) | infer T
        ? Args extends { props: infer P }
          ? {
              [key in keyof T]: key extends keyof P
                ? NonNullable<P[key]>
                : T[key]
            }
          : Value
        : never
    }
  }
}

export const WithDefaultProps = createMethodRecord({
  DefaultProps: {
    symbol: withDefaultProps,
    field: 'props',
    transform: <A extends { props: {} }, P>(args: A, useProps: P) => ({
      ...(typeof useProps === 'function' ? useProps(args) : useProps),
      ...args.props,
    }),
  },
} as const)
