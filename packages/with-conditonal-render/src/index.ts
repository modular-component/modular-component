import { createMethodRecord } from '@modular-component/core'

import { FunctionComponent } from 'react'

const withCondition = Symbol()
const withConditionalFallback = Symbol()
const withConditionalRender = Symbol()

declare module '@modular-component/core' {
  export interface ModularStages<Args, Value> {
    [withCondition]: {
      restrict: (args: Args) => boolean
      transform: ReturnType<
        Value extends (args: Args) => boolean ? Value : never
      >
    }
    [withConditionalFallback]: {
      restrict: FunctionComponent<Args>
      transform: ReturnType<FunctionComponent<Args>> | null
    }
    [withConditionalRender]: {
      restrict: FunctionComponent<Args>
      transform: ReturnType<FunctionComponent<Args>> | null
    }
  }
}

export const WithConditionalRender = createMethodRecord({
  Condition: {
    symbol: withCondition,
    field: 'condition',
    transform: <
      A extends { condition?: boolean },
      C extends (args: A) => boolean,
    >(
      args: A,
      useCondition: C,
    ) => args.condition !== false && useCondition(args),
  },
  ConditionalRender: {
    symbol: withConditionalRender,
    field: 'render',
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

      return useRender(args)
    },
  },
  ConditionalFallback: {
    symbol: withConditionalFallback,
    field: 'render',
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

      return useRender(args)
    },
  },
} as const)
