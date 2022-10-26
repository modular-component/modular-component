import { MethodName, MethodRecord, Modular, StageEntry } from './types'
import { FunctionComponent } from 'react'

export type { Modular, ModularStageTransform, MethodRecord } from './types'

function ModularFactory<Methods extends MethodRecord>(methods: Methods) {
  type CleanMethods = Methods extends infer U
    ? { [key in keyof U]: U[key] }
    : never

  return {
    build: <Stages extends StageEntry[] = []>(
      stages: Omit<StageEntry, 'stages'>[] = [],
    ) => {
      return <Props = {}>(displayName?: string) => {
        // Create the actual Component. This is a simple React Functional Component
        // that will call the hooks for each registered stages in order.
        const Component = ((props) => {
          // Prepare the shared arguments object, prefilling it with the props
          // and an empty render result
          const useComponent = Component.asHook()
          const args = useComponent(props)

          return (args as unknown as { render: null }).render ?? null
        }) as Modular<Props, CleanMethods, Stages>

        // Set the debug display name if provided
        Component.displayName = displayName

        // Add an asHook system to get the components args as a reusable hook
        Component.asHook = ((field: string) => (props: Props = {} as Props) => {
          // Prepare the shared arguments object, prefilling it with the props
          // and an empty render result
          let args = { props, children: (props as { children?: unknown })?.children, render: null }

          // Run each stage in order, replacing the arguments by the response
          // from the last stage
          for (const stage of stages) {
            const method = methods[stage.key as MethodName]
            const useStage = stage.value

            const useTransform =
              // Never transform mocked stages
              (stage.mocked ? undefined : method.transform) ??
              (() =>
                typeof useStage === 'function'
                  ? useStage({ ...args })
                  : useStage)

            args = {
              ...args,
              [method.field as keyof typeof args]: useTransform(args, useStage),
            }
          }

          // Finally, return the args
          return field ? args[field as keyof typeof args] : args
        }) as unknown as Modular<Props, CleanMethods, Stages>['asHook']

        // Add a function for rewinding the component up to a certain stage
        Component.atStage = ((stage: MethodName) => {
          // Find the needed stage
          const stageIndex = (stages
            // Map all stages to an [index, stage] tuple
            .map((record, index) => [index, record] as const)
            // Remove all tuples not matching our stage
            .filter(([, record]) => record.key === stage)
            // Get the index of the very last one, or -1 if none are remaining
            .pop() || [-1])[0]

          // If the stage cannot be found, create a brand new, empty component
          if (stageIndex === -1) {
            return ModularFactory<Methods>(methods).build()<Props>(displayName)
          }

          // Otherwise, keep all stages up to and including the found stage
          return ModularFactory<Methods>(methods).build(
            stages.slice(0, stageIndex + 1),
          )<Props>(displayName)
        }) as unknown as Modular<Props, CleanMethods, Stages>['atStage']

        // Add a function for conveniently mocking a stage value, regardless of its transform system
        Component.mockStage = ((key: MethodName, value: unknown) => {
          const stage = { key, value, mocked: true }

          // Find the needed stage
          const stageIndex = (stages
            // Map all stages to an [index, stage] tuple
            .map((record, index) => [index, record] as const)
            // Remove all tuples not matching our stage
            .filter(([, record]) => record.key === key)
            // Get the index of the very last one, or -1 if none are remaining
            .pop() || [-1])[0]

          // If the stage cannot be found, create a brand new, empty component
          if (stageIndex === -1) {
            return ModularFactory<Methods>(methods).build()<Props>(displayName)
          }

          // Else, replace the stage with its mock
          const nextStages = [...stages]
          nextStages[stageIndex] = stage
          return ModularFactory(methods).build(nextStages)<Props>(
            displayName,
          )
        }) as unknown as Modular<
          Props,
          CleanMethods,
          Stages
          >['mockStage']

        // Add each configured stage method to the component
        Object.keys(methods).forEach((method) => {
          Component[method as keyof CleanMethods] = ((value: unknown) => {
            // Prepare the new stage
            const stage = { key: method as MethodName, value }

            // For stages in "multiple" mode, simply append the stage
            if (methods[method as MethodName].multiple) {
              return ModularFactory(methods).build([...stages, stage])<Props>(
                displayName,
              )
            }

            // For other stages, check if a stage of the same key already exists
            const index = stages.findIndex((st) => st.key === method)

            // If so, copy the stages and replace the previous record
            if (index > -1) {
              const nextStages = [...stages]
              nextStages[index] = stage
              return ModularFactory(methods).build(nextStages)<Props>(
                displayName,
              )
            }

            // Otherwise, append the stage as in multiple mode
            return ModularFactory(methods).build([...stages, stage])<Props>(
              displayName,
            )
          }) as unknown as Modular<
            Props,
            CleanMethods,
            Stages
          >[keyof CleanMethods]
        })

        return Component
      }
    },
    extend: <_Methods extends MethodRecord>(_methods: _Methods) => {
      return ModularFactory<Methods & _Methods>({
        ...methods,
        ..._methods,
      })
    },
  }
}

export const modularFactory = ModularFactory({
  withRender: {
    field: 'render',
    restrict: {} as ReturnType<FunctionComponent>,
  },
} as const)

export function createMethodRecord<R extends MethodRecord>(record: R): R {
  return record
}
