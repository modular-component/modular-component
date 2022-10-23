import { createMethodRecord } from '@modular-component/core'
import { FunctionComponent } from 'react'

const withConditionalFallback = Symbol()
const withConditionalRender = Symbol()

export const WithConditionalRender = createMethodRecord({
  withCondition: {
    field: 'condition',
    multiple: true,
    transform: <
      A extends { condition?: boolean },
      C extends (args: A) => boolean,
    >(
      args: A,
      useCondition: C,
    ) =>
      args.condition !== false &&
      (typeof useCondition === 'function' ? useCondition(args) : useCondition),
    restrict: {} as boolean,
  },
  withConditionalFallback: {
    field: 'render',
    multiple: true,
    symbol: withConditionalFallback,
    transform: <
      A extends { condition?: boolean; render?: ReturnType<FunctionComponent> },
      P extends FunctionComponent<A>,
    >(
      args: A,
      useRender: P,
    ) => {
      if (args.condition !== false || args.render) {
        return args.render
      }

      return typeof useRender === 'function' ? useRender(args) : useRender
    },
    restrict: {} as ReturnType<FunctionComponent>,
  },
  withConditionalRender: {
    field: 'render',
    symbol: withConditionalRender,
    transform: <
      A extends { condition?: boolean; render?: ReturnType<FunctionComponent> },
      P extends FunctionComponent<A>,
    >(
      args: A,
      useRender: P,
    ) => {
      if (args.condition === false) {
        return args.render
      }

      return typeof useRender === 'function' ? useRender(args) : useRender
    },
    restrict: {} as ReturnType<FunctionComponent>,
  },
} as const)

declare module '@modular-component/core' {
  export interface ModularStageTransform<T> {
    [withConditionalFallback]: T | null
    [withConditionalRender]: T | null
  }
}
