import { ForwardedRef, FunctionComponent, forwardRef, memo } from 'react'

import { ModularComponent } from './types/modular-component'
import { MethodRecord } from './types/methods'
import { StageTuple } from './types/stage'

export type { ModularStages } from './types/stage'

function ModularFactory<Methods extends Record<string, MethodRecord>>(
  methods: Methods,
) {
  type CleanMethods = Methods extends infer U
    ? { [key in keyof U]: U[key] }
    : never

  return {
    build: <Stages extends StageTuple = []>(stages: StageTuple = []) => {
      const factory = <Props extends {} = {}, Ref = FunctionComponent<Props>>(
        displayName?: string,
        options?: { memo: boolean },
      ) => {
        const generateAsHook =
          (ref?: ForwardedRef<Ref>, field?: string) =>
          () =>
          (props: Props = {} as Props) => {
            // Prepare the shared arguments object, prefilling it with the props
            // and an empty render result
            let args = {
              props,
              children: (props as { children?: unknown })?.children,
              render: null,
              ref,
            }

            const methodsArray = Object.values(methods)

            // Run each stage in order, replacing the arguments by the response
            // from the last stage
            for (const stage of stages) {
              const method = methodsArray.find(
                (method) => method.symbol === stage.stage,
              )

              let useTransform =
                // Never transform mocked stages
                ((stage as any).mocked ? undefined : method?.transform) ??
                (() => stage.value)

              args = {
                ...args,
                [method?.field as keyof typeof args]: useTransform(
                  args,
                  stage.value,
                ),
              }
            }

            // Finally, return the args
            return field ? args[field as keyof typeof args] : args
          }

        // Create the actual Component. This is a simple React Functional Component
        // that will call the hooks for each registered stages in order.
        const Component = forwardRef<Ref, Props>((props, ref) => {
          // Prepare the shared arguments object, prefilling it with the props
          // and an empty render result
          const useComponent = generateAsHook(ref)()
          const args = useComponent(props)

          return (args as unknown as { render: null }).render ?? null
        }) as unknown as ModularComponent<Props, Ref, CleanMethods, Stages>

        // Set the debug display name if provided
        Component.displayName = displayName

        // Add an asHook system to get the components args as a reusable hook
        Component.asHook = generateAsHook() as ModularComponent<
          Props,
          Ref,
          CleanMethods,
          Stages
        >['asHook']

        // Add each configured stage methods to the component
        Object.keys(methods).forEach((method) => {
          // Check if a stage of the same key already exists
          const stageIndices = stages
            // Map all stages to an [index, stage] tuple
            .map((record, index) => [index, record] as const)
            // Remove all tuples not matching our stage
            .filter(([, record]) => record.stage === methods[method].symbol)
            // Get the index
            .map(([index]) => index)
          const lastIndex = [...stageIndices].pop() as number

          // @ts-ignore
          Component[`with${method}`] = (
            value: unknown,
            forceIndex?: number,
          ) => {
            // Prepare the new stage
            const stage = { stage: methods[method].symbol, value } as const

            // Check if a stage of the same key already exists
            const stageIndex =
              (forceIndex !== undefined
                ? stageIndices[forceIndex]
                : lastIndex) ?? -1

            // If so, copy the stages and replace the previous record
            if (stageIndex > -1) {
              const nextStages = [...stages]
              nextStages[stageIndex] = stage
              return ModularFactory(methods).build(nextStages)<Props>(
                displayName,
              )
            }

            // Otherwise, append the stage
            return ModularFactory(methods).build([...stages, stage])<Props>(
              displayName,
            )
          }

          // @ts-ignore
          Component[`add${method}`] =
            stageIndices.length < 1
              ? undefined
              : (value: unknown) => {
                  // Prepare the new stage
                  const stage = {
                    stage: methods[method].symbol,
                    value,
                  } as const

                  // Append the stage as in multiple mode
                  return ModularFactory(methods).build([
                    ...stages,
                    stage,
                  ])<Props>(displayName)
                }

          // @ts-ignore
          Component[`at${method}`] =
            stageIndices.length < 1
              ? undefined
              : (forceIndex?: number) => {
                  // Find the needed stage
                  const stageIndex =
                    (forceIndex !== undefined
                      ? stageIndices[forceIndex]
                      : lastIndex) ?? lastIndex

                  // Otherwise, keep all stages up to and including the found stage
                  return ModularFactory<Methods>(methods).build(
                    stages.slice(0, stageIndex + 1),
                  )<Props>(displayName)
                }

          // @ts-ignore
          Component[`before${method}`] =
            stageIndices.length < 1
              ? undefined
              : (forceIndex?: number) => {
                // Find the needed stage
                const stageIndex =
                  (forceIndex !== undefined
                    ? stageIndices[forceIndex]
                    : lastIndex) ?? lastIndex

                // Otherwise, keep all stages up to but excluding the found stage
                return ModularFactory<Methods>(methods).build(
                  stages.slice(0, stageIndex),
                )<Props>(displayName)
              }

          // @ts-ignore
          Component[`mock${method}`] =
            stageIndices.length < 1
              ? () => Component
              : (value: unknown, forceIndex?: number) => {
                  // Prepare the mocked stage
                  const stage = {
                    stage: methods[method].symbol,
                    value,
                    mocked: true,
                  } as const

                  // Find the needed stage
                  const stageIndex =
                    (forceIndex !== undefined
                      ? stageIndices[forceIndex]
                      : lastIndex) ?? lastIndex

                  // Replace the stage with its mock
                  const nextStages = [...stages]
                  nextStages[stageIndex] = stage
                  return ModularFactory(methods).build(nextStages)<Props>(
                    displayName,
                  )
                }

          const capitalize = (str: string) =>
            str[0].toUpperCase() + str.slice(1)

          // @ts-ignore
          Component[`asUse${capitalize(methods[method].field)}`] =
            generateAsHook(undefined, methods[method].field)
        })

        return (options?.memo ? memo(Component) : Component) as typeof Component
      }

      factory.memo = <Props extends {} = {}, Ref = FunctionComponent<Props>>(
        displayName?: string,
      ) => factory<Props, Ref>(displayName, { memo: true })

      return factory
    },
    extend: <_Methods extends Record<string, MethodRecord>>(
      _methods: _Methods,
    ) => {
      return ModularFactory<Methods & _Methods>({
        ...methods,
        ..._methods,
      })
    },
  }
}

const withRender = Symbol()

declare module './types/stage' {
  export interface ModularStages<Args, Value> {
    [withRender]: {
      restrict: FunctionComponent<Args>
      transform: ReturnType<
        Value extends FunctionComponent<Args> ? Value : never
      >
    }
  }
}

export const modularFactory = ModularFactory({
  Render: {
    symbol: withRender,
    field: 'render',
    transform: (args, useStage) => useStage(args),
  },
} as const)

export function createMethodRecord<R extends Record<string, MethodRecord>>(
  record: R,
): R {
  return record
}
