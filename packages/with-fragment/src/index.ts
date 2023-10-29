import { ReactNode } from 'react'
import { ModularStage } from '@modular-component/core'

export function fragment<
  Args extends {},
  Fragments extends Record<string, ReactNode>,
>(
  useFragment: (args: Args) => Fragments,
): ModularStage<'fragments', (args: Args) => Fragments>
export function fragment<
  Args extends {},
  Fragment extends ReactNode,
  Key extends string,
>(
  key: Key,
  useFragment: (args: Args) => Fragment,
): ModularStage<Key, (args: Args) => Fragment>

export function fragment<Key extends string, Stage extends () => unknown>(
  key: Key | Stage,
  useFragment?: Stage,
): ModularStage<Key, Stage> {
  return {
    field: (typeof key === 'string' ? key : 'fragments') as Key,
    useStage: (typeof key === 'string' ? useFragment : key) as Stage,
  }
}
