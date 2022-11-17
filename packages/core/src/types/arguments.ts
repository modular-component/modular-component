/**
 * Helpers for computing the arguments map generated by a given
 * set of stages
 */

import { StageTuple, ModularStages, BeforeStage, CleanUpStages } from './stage'
import { UnionToIntersection } from './utils'

export type ComputeArguments<
  Props extends {},
  Methods extends Record<
    string,
    { symbol: keyof ModularStages; field: string }
  >,
  Stages extends StageTuple,
  CleanedStages extends StageTuple = CleanUpStages<Stages>,
  MethodList = Methods[keyof Methods],
> = { props: Props } & (Stages['length'] extends 0
  ? {}
  : UnionToIntersection<
      {
        [key in keyof CleanedStages]: MethodList extends {
          symbol: CleanedStages[key]['stage']
          field: infer F
        }
          ? {
              [k in F extends string ? F : never]: ModularStages<
                ComputeArguments<
                  Props,
                  Methods,
                  BeforeStage<CleanedStages, key>
                >,
                CleanedStages[key]['value']
              >[CleanedStages[key]['stage']] extends { transform: infer T }
                ? T
                : CleanedStages[key]['value']
            }
          : never
      }[number]
    >) extends infer U
  ? {
      [key in keyof U]: U[key] extends Record<string, unknown>
        ? U[key] extends infer V
          ? { [key in keyof V]: V[key] }
          : never
        : U[key]
    }
  : never