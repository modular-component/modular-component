import type { FunctionComponent } from 'react'
import type { ModularContext } from '@modular-component/stages'
import type { ModularComponent } from './index'

export type { ModularContext } from '@modular-component/stages'

export type GetArgsFor<
  Context extends ModularContext,
  Field extends string,
> = Field extends keyof Context['stages']
  ? Pick<Context['arguments'], Context['stages'][Field]>
  : Context['arguments']

export type GetConstraintFor<
  Context extends ModularContext,
  Field extends string,
  Default = any,
> = Field extends 'render'
  ? ReturnType<FunctionComponent>
  : Field extends keyof Context['constraints']
  ? Context['constraints'][Field]
  : Default

export type GetValueGetterFor<
  Context extends ModularContext,
  Field extends string,
  Type,
> = Type | ((args: GetArgsFor<Context, Field>) => Type)

type AppendArguments<Arguments, Field extends string, Type> = {
  [key in Exclude<keyof Arguments, Field>]: Arguments[key]
} & {
  [key in Field]: Type
} extends infer U
  ? { [key in keyof U]: U[key] }
  : never

type AppendConstraints<Constraints, Backup, Field extends string, Type> = {
  [key in Exclude<keyof Constraints, Field>]: Constraints[key]
} & {
  [key in Exclude<keyof Backup, Field>]: Backup[key]
} & {
  [key in Field]: Type
} extends infer U
  ? { [key in keyof U]: U[key] }
  : never

type AppendStages<Stages, Arguments, Field extends string, Type> = {
  [key in Exclude<keyof Stages, Field>]: Stages[key]
} & {
  [key in Field]: key extends keyof Stages ? Stages[key] : keyof Arguments
} extends infer U
  ? { [key in keyof U]: U[key] }
  : never

export type AppendStage<
  Context extends ModularContext,
  Field extends string,
  Type,
> = Pick<Context, 'props' | 'ref'> & {
  arguments: AppendArguments<Context['arguments'], Field, Type>
  constraints: AppendConstraints<
    Context['constraints'],
    Context['_constraints'],
    Field,
    Type
  >
  stages: AppendStages<Context['stages'], Context['arguments'], Field, Type>
} extends infer U
  ? { [key in keyof U]: U[key] }
  : never

export type StageParams<Fn extends (...args: any[]) => any> = Parameters<Fn>
export type StageReturn<
  Fn extends (
    ...args: any[]
  ) => (ctx?: any) => { field: string; provide: (args: any) => any },
> = ModularComponent<
  AppendStage<
    NonNullable<Parameters<ReturnType<Fn>>[0]>,
    ReturnType<ReturnType<Fn>>['field'],
    ReturnType<ReturnType<ReturnType<Fn>>['provide']>
  >
> extends ModularComponent<infer U>
  ? ModularComponent<U>
  : never

export function addTo<Context extends ModularContext>() {
  return {
    on<Field extends string>(field: Field) {
      return {
        provide<Stage extends (args: GetArgsFor<Context, Field>) => any>(
          stage: Stage,
        ) {
          return (_?: Context) => ({
            field,
            provide: stage,
          })
        },
      }
    },
  }
}

export function wrap<Args, Type>(useFn: Type | ((args: Args) => Type)) {
  return (args: Args) => {
    return typeof useFn === 'function'
      ? (useFn as (args: Args) => Type)(args)
      : useFn
  }
}
