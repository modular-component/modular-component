/**
 * Methods for mocking the value returned by a given stage,
 * replacing the stage and bypassing its transform function
 */

import { ModularComponent } from '../modular-component'
import { MethodRecord } from '../methods'
import { ValidateIndex } from '../validation'
import { ComputeArguments } from '../arguments'
import { FilterNever, Last, ToIndices } from '../utils'
import { BeforeStage, ModularStages, StageIndices, StageTuple } from '../stage'

interface ModularMockMethodIndices<
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
      Methods,
      BeforeStage<Stages, StageIndex>
    >,
    // Value validation
    Value extends Stages[StageIndex]['value'],
    Mock extends ModularStages<Arguments, Value>[Symbol] extends {
      transform: infer T
    }
      ? T
      : Value,
    // Validate index
    StageIndex extends Index extends number ? Indices[Index] : Last<Indices>,
    ValidIndex extends ValidateIndex<Index, ToIndices<Indices>>,
    Index extends number,
  >(
    mock: Mock,
    index: ValidIndex extends true ? Index : ToIndices<Indices>,
  ): ModularComponent<Props, Ref, Methods, Stages>
}

interface ModularMockMethodLast<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Method extends keyof Methods,
  Index extends number,
  Symbol extends keyof ModularStages = Methods[Method]['symbol'],
> {
  <
    // Value validation
    Value extends Stages[Index]['value'],
    Mock extends ModularStages<any, Value>[Symbol] extends {
      transform: infer T
    }
      ? T
      : Value,
  >(
    mock: Mock,
  ): ModularComponent<Props, Ref, Methods, Stages>
}

type ModularMockMethod<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Method extends keyof Methods,
  Symbol extends keyof ModularStages = Methods[Method]['symbol'],
  Indices extends StageIndices<Stages, Symbol> = StageIndices<Stages, Symbol>,
> = Indices['length'] extends 0
  ? never
  : ModularMockMethodIndices<Props, Ref, Methods, Stages, Method, Indices> &
      ModularMockMethodLast<Props, Ref, Methods, Stages, Method, Last<Indices>>

export type ModularMockMethods<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
> = FilterNever<{
  [Method in keyof Methods as `mock${Method extends string
    ? Method
    : never}`]: ModularMockMethod<Props, Ref, Methods, Stages, Method>
}>
