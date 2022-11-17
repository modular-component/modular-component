/**
 * Helper for manipulating stages and stage tuples
 */

import { At, Before, Reduce, After, OneLess } from './utils'

export interface ModularStages<Args = any, Value = any> {}

type StageRecord = {
  stage: keyof ModularStages
  value: unknown
}
export type StageTuple = StageRecord[]

export type AddStage<List extends StageTuple, Stage extends StageRecord> = [
  ...List,
  Stage,
]

export type ReplaceStageAt<
  List extends StageTuple,
  Stage extends StageRecord,
  At extends number | string,
> = {
  [Index in keyof List]: Index extends At
    ? List[Index]['stage'] extends Stage['stage']
      ? Stage
      : List[Index]
    : List[Index]
}

type ReplaceStage<
  List extends StageTuple,
  Stage extends StageRecord,
  At extends number | string = never,
> = [At] extends [never]
  ? {
      [Index in keyof List]: List[Index]['stage'] extends Stage['stage']
        ? Stage
        : List[Index]
    }
  : ReplaceStageAt<List, Stage, At>

export type ExtractStage<
  List extends StageTuple,
  Stage extends symbol,
  Union = List[number],
> = Union extends { stage: Stage; value: infer U }
  ? { stage: Stage; value: U }
  : never

export type UpsertStage<
  List extends StageTuple,
  Stage extends StageRecord,
  At extends number = never,
> = [ExtractStage<List, Stage['stage']>] extends [never]
  ? AddStage<List, Stage>
  : ReplaceStage<List, Stage, At>

type IsolateStage<Tuple extends StageTuple, Stage extends symbol> = {
  [key in keyof Tuple]: Tuple[key]['stage'] extends Stage ? key : never
}

export type StageIndices<
  Tuple extends StageTuple,
  Stage extends symbol,
> = Reduce<IsolateStage<Tuple, Stage>>

export type AtStage<
  Tuple extends StageTuple,
  Index extends number | string,
> = At<Tuple, Index> extends StageTuple ? At<Tuple, Index> : []

export type BeforeStage<
  Tuple extends StageTuple,
  Index extends number | string,
> = Before<Tuple, Index> extends StageTuple ? Before<Tuple, Index> : []

type AfterStage<
  Tuple extends StageTuple,
  Index extends number | string,
> = After<Tuple, Index> extends StageTuple ? After<Tuple, Index> : []

export type CleanUpStages<Tuple extends StageTuple> = {
  [key in keyof Tuple]: StageIndices<
    OneLess<AfterStage<Tuple, key>>,
    Tuple[key]['stage']
  >['length'] extends 0
    ? Tuple[key]
    : never
}
