/**
 * Methods for adding a new entry for a previous stage, rather
 * than reusing the previous one.
 * One two entries for the same stage have been added, `with`, `at` and
 * `mock` methods can take an optional index to select the entry to target
 */

import { ModularComponent } from '../modular-component'
import { AddStage, ModularStages, StageIndices, StageTuple } from '../stage'
import { ComputeArguments } from '../arguments'
import { RestrictValue } from '../validation'
import { MethodRecord } from '../methods'
import { FilterNever } from '../utils'

interface ModularAddMethod<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Method extends keyof Methods,
  Symbol extends keyof ModularStages = Methods[Method]['symbol'],
> {
  <
    Value extends RestrictValue<Arguments, Symbol>,
    Arguments extends ComputeArguments<Props, Ref, Methods, Stages>,
  >(
    ...args: undefined extends RestrictValue<Arguments, Symbol>
      ? [value?: Value]
      : [value: Value]
  ): ModularComponent<
    Props,
    Ref,
    Methods,
    AddStage<Stages, { stage: Symbol; value: Value }>
  >
}

export type ModularAddMethods<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
> = FilterNever<{
  [Method in keyof Methods as `add${Method extends string
    ? Method
    : never}`]: StageIndices<
    Stages,
    Methods[Method]['symbol']
  >['length'] extends 0
    ? never
    : ModularAddMethod<Props, Ref, Methods, Stages, Method>
}>
