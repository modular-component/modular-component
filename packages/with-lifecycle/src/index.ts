import { ModularStage } from '@modular-component/core'

export function lifecycle<Args extends {}, Return>(
  useLifecycle: (args: Args) => Return,
): ModularStage<'lifecycle', (args: Args) => Return> {
  return { field: 'lifecycle', useStage: useLifecycle }
}
