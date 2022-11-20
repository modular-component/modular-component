/**
 * Main factory methods adding or editing an entry for a given
 * stage. If multiple entries for the same stage were added
 * with the `add` method, an index can be passed to select the
 * entry to edit.
 */

import { ModularComponent } from '../modular-component'
import { Last, ToIndices } from '../utils'
import {
  BeforeStage,
  ModularStages,
  StageIndices,
  StageTuple,
  UpsertStage,
} from '../stage'
import { MethodRecord } from '../methods'
import { ComputeArguments } from '../arguments'
import { RestrictValue, ValidateIndex } from '../validation'

interface ModularWithMethodDefault<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Method extends keyof Methods,
  Symbol extends keyof ModularStages = Methods[Method]['symbol'],
  Arguments extends {} = ComputeArguments<Props, Ref, Methods, Stages>,
> {
  <Value extends RestrictValue<Arguments, Symbol>>(
    ...args: undefined extends RestrictValue<Arguments, Symbol>
      ? [value?: Value]
      : [value: Value]
  ): ModularComponent<
    Props,
    Ref,
    Methods,
    UpsertStage<Stages, { stage: Symbol; value: Value }>
  >
}

interface ModularWithMethodIndices<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Method extends keyof Methods,
  Indices extends number[],
  Symbol extends keyof ModularStages = Methods[Method]['symbol'],
> {
  <
    Arguments extends ComputeArguments<
      Props,
      Ref,
      Methods,
      BeforeStage<Stages, StageIndex>
    >,
    // Validate value
    Value extends RestrictValue<Arguments, Symbol>,
    PreviousValue extends Stages[StageIndex]['value'],
    Valid extends ModularStages<Arguments, Value>[Symbol] extends {
      validate: infer V
    }
      ? V
      : ModularStages<Arguments, Value>[Symbol] extends {
          transform: infer V
        }
      ? V
      : Value,
    PreviousValid extends ModularStages<
      Arguments,
      PreviousValue
    >[Symbol] extends {
      validate: infer V
    }
      ? V
      : ModularStages<Arguments, PreviousValue>[Symbol] extends {
          transform: infer V
        }
      ? V
      : PreviousValue,
    ValidValue extends [Valid] extends [PreviousValid] ? true : false,
    // Validate index
    StageIndex extends Index extends number ? Indices[Index] : Last<Indices>,
    ValidIndex extends ValidateIndex<Index, ToIndices<Indices>>,
    Index extends number,
  >(
    value: ValidValue extends true ? Value : PreviousValue,
    index: ValidIndex extends true ? Index : ToIndices<Indices>,
  ): ModularComponent<
    Props,
    Ref,
    Methods,
    UpsertStage<Stages, { stage: Symbol; value: Value }, StageIndex>
  >
}

interface ModularWithMethodLast<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Method extends keyof Methods,
  Index extends number,
  Symbol extends keyof ModularStages = Methods[Method]['symbol'],
  Arguments extends {} = ComputeArguments<
    Props,
    Ref,
    Methods,
    BeforeStage<Stages, Index>
  >,
> {
  <
    // Validate value
    Value extends RestrictValue<Arguments, Symbol>,
    PreviousValue extends Stages[Index]['value'],
    Valid extends ModularStages<Arguments, Value>[Symbol] extends {
      validate: infer V
    }
      ? V
      : ModularStages<Arguments, Value>[Symbol] extends {
          transform: infer V
        }
      ? V
      : Value,
    PreviousValid extends ModularStages<
      Arguments,
      PreviousValue
    >[Symbol] extends {
      validate: infer V
    }
      ? V
      : ModularStages<Arguments, PreviousValue>[Symbol] extends {
          transform: infer V
        }
      ? V
      : PreviousValue,
    ValidValue extends [Valid] extends [PreviousValid] ? true : false,
  >(
    ...args: undefined extends PreviousValue
      ? [value?: ValidValue extends true ? Value : PreviousValue]
      : [value: ValidValue extends true ? Value : PreviousValue]
  ): ModularComponent<
    Props,
    Ref,
    Methods,
    UpsertStage<Stages, { stage: Symbol; value: Value }, Index>
  >
}

type ModularWithMethod<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Method extends keyof Methods,
  Symbol extends keyof ModularStages = Methods[Method]['symbol'],
  Indices extends StageIndices<Stages, Symbol> = StageIndices<Stages, Symbol>,
> = Indices['length'] extends 0
  ? ModularWithMethodDefault<Props, Ref, Methods, Stages, Method>
  : ModularWithMethodIndices<Props, Ref, Methods, Stages, Method, Indices> &
      ModularWithMethodLast<Props, Ref, Methods, Stages, Method, Last<Indices>>

export type ModularWithMethods<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
> = {
  [Method in keyof Methods as `with${Method extends string
    ? Method
    : never}`]: ModularWithMethod<Props, Ref, Methods, Stages, Method>
}
