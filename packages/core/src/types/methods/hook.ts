/**
 * Methods for converting a modular component to hooks, either
 * a generic hook returning all the arguments, or a specific hook
 * returning one given argument.
 */

import { StageTuple } from '../stage'
import { MethodRecord } from '../methods'
import { ComputeArguments } from '../arguments'

export type ModularHookMethods<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Arguments extends {} = ComputeArguments<Props, Methods, Stages>,
> = {
  asHook(): keyof Props extends never
    ? () => Arguments
    : (props: Props) => Arguments
} & {
  [Arg in keyof Arguments as `asUse${Capitalize<
    Arg extends string ? Arg : never
  >}`]: keyof Props extends never
    ? () => () => Arguments[Arg]
    : () => (props: Props) => Arguments[Arg]
}
