/**
 * Methods for rewinding a modular component up to a given stage.
 * If multiple entries of the same stage were previously added,
 * it's possible to pass the index for the entry to rewind to.
 */

import { ModularComponent } from '../modular-component'
import { AtStage, StageIndices, StageTuple } from '../stage'
import { FilterNever, Last, ToIndices } from '../utils'
import { ValidateIndex } from '../validation'
import { MethodRecord } from '../methods'

interface ModularAtMethodIndices<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Method extends keyof Methods,
  Indices extends number[],
> {
  <
    // Validate index
    StageIndex extends Index extends number ? Indices[Index] : Last<Indices>,
    ValidIndex extends ValidateIndex<Index, ToIndices<Indices>>,
    Index extends number,
  >(
    index: ValidIndex extends true ? Index : ToIndices<Indices>,
  ): ModularComponent<Props, Ref, Methods, AtStage<Stages, StageIndex>>
}

interface ModularAtMethodLast<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Method extends keyof Methods,
  Index extends number,
> {
  (): ModularComponent<Props, Ref, Methods, AtStage<Stages, Index>>
}

type ModularAtMethod<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
  Method extends keyof Methods,
  Symbol extends symbol = Methods[Method]['symbol'],
  Indices extends StageIndices<Stages, Symbol> = StageIndices<Stages, Symbol>,
> = Indices['length'] extends 0
  ? never
  : ModularAtMethodIndices<Props, Ref, Methods, Stages, Method, Indices> &
      ModularAtMethodLast<Props, Ref, Methods, Stages, Method, Last<Indices>>

export type ModularAtMethods<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
> = FilterNever<{
  [Method in keyof Methods as `at${Method extends string
    ? Method
    : never}`]: ModularAtMethod<Props, Ref, Methods, Stages, Method>
}>
