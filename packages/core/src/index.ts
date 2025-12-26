import {
  ForwardRefRenderFunction,
  FunctionComponent,
  PropsWithChildren,
} from 'react'
import {
  ModularComponentPresets,
  ModularComponentStages,
  ModularContext,
} from '@modular-component/stages'
import { AppendStage, GetArgsFor, GetConstraintFor } from './extend'

type FunctionComponentOrRefRenderFunction<Props, Ref> = [Ref] extends [never]
  ? FunctionComponent<PropsWithChildren<Props>>
  : Omit<
      ForwardRefRenderFunction<Ref, PropsWithChildren<Props>>,
      'defaultProps' | 'propTypes'
    >

export type { ModularContext } from '@modular-component/stages'

type MapToForce<Stages> = {
  [key in keyof Stages as key extends `with${infer K}`
    ? `force${K}`
    : never]: Stages[key]
}

type MapToStage<Stages> = Pick<
  Stages,
  {
    [key in keyof Stages]: key extends `with${string}` ? key : never
  }[keyof Stages]
>

type MapToRaw<Stages> = {
  [key in keyof Stages as key extends `with${infer K}`
    ? Uncapitalize<K>
    : never]: Stages[key]
}

type Force<Context extends ModularContext> = Omit<Context, 'constraints'> & {
  constraints: {}
  _constraints: Context['constraints']
}

export type ModularComponent<Context extends ModularContext> =
  FunctionComponentOrRefRenderFunction<Context['props'], Context['ref']> &
    MapToStage<ModularComponentStages<Context>> &
    MapToForce<ModularComponentStages<Force<Context>>> & {
      with<Field extends string, Type extends GetConstraintFor<Context, Field>>(
        stage: (context?: Context) => {
          field: Field
          provide: (args: GetArgsFor<Context, Field>) => Type
        },
      ): ModularComponent<AppendStage<Context, Field, Type>>
      force<Field extends string, Type>(
        stage: (context?: Force<Context>) => {
          field: Field
          provide: (args: GetArgsFor<Context, Field>) => Type
        },
      ): ModularComponent<AppendStage<Context, Field, Type>>

      use<Field extends keyof Context['arguments']>(
        key: Field,
      ): {} extends Context['arguments']['props']
        ? () => Context['arguments'][Field]
        : (
            props: PropsWithChildren<Context['arguments']['props']>,
          ) => Context['arguments'][Field]
      use(): {} extends Context['props']
        ? () => Context['arguments']
        : (props: PropsWithChildren<Context['props']>) => Context['arguments']
      stage<Field extends keyof Context['arguments'] & string>(
        key: Field,
      ): (
        args: Partial<GetArgsFor<Context, Field>>,
      ) => Context['arguments'][Field]
      withDisplayName(displayName: string): ModularComponent<Context>
    }

type ApplyPreset<Context extends ModularContext, Props extends {}, Ref> = {
  props: Context['props'] & Props
  ref: Ref
  stages: Context['stages']
  arguments: Context['arguments'] & {
    props: Props
    ref: Ref
  } extends infer U
    ? { [key in keyof U]: U[key] }
    : never
  constraints: Context['constraints'] & {
    props: Props
    ref: Ref
  } extends infer U
    ? { [key in keyof U]: U[key] }
    : never
}

let customFunctions: Record<
  string,
  (...args: any[]) => (ctx?: ModularContext) => {
    field: string
    provide: (args: any) => any
  }
> = {}
const basePreset = InternalFactory([], undefined) as ModularComponent<{
  props: {}
  ref: never
  constraints: {
    render: ReturnType<FunctionComponent>
  }
  arguments: {
    render: ReturnType<FunctionComponent>
  }
  stages: {}
}>
const presets: Record<string, ModularComponent<any>> = {
  default: basePreset,
  base: basePreset,
}

declare module '@modular-component/stages' {
  export interface ModularComponentPresets {
    base: typeof basePreset
  }
}

function InternalFactory<Context extends ModularContext>(
  stages: { field: string; provide: (args: any) => any }[],
  displayName: string | undefined,
): ModularComponent<Context> {
  const UseComponent = function (props: Context['props'], ref: Context['ref']) {
    return UseComponent.use('render')(props, ref)
  }
  UseComponent.displayName = displayName

  UseComponent.with = (
    _stage: (ctx?: Context) => { field: string; provide: (args: any) => any },
  ) => {
    const stage = _stage()
    const index = stages.findIndex((s) => s.field === stage.field)

    if (index !== -1) {
      const next = [...stages]
      next[index] = stage
      return InternalFactory<Context>(next, displayName)
    }

    return InternalFactory<Context>([...stages, stage], displayName)
  }
  UseComponent.force = UseComponent.with

  UseComponent.use = (field?: string) => {
    const index = field
      ? stages.findIndex((stage) => stage.field === field)
      : -1
    const argStages =
      index === -1 ? stages.slice(0) : stages.slice(0, index + 1)

    return (props = {}, ref = null) => {
      const args: Record<string, any> = { props, ref }
      if (field === 'render') {
        args.render = null
      }
      for (let stage of argStages) {
        args[stage.field] = stage.provide(args)
      }
      return field ? args[field] : args
    }
  }

  UseComponent.stage = (field: string) => {
    const stage = stages.find((stage) => stage.field === field)
    return stage?.provide ?? (() => null)
  }

  Object.entries(customFunctions).forEach(([name, fn]) => {
    ;(UseComponent as any)[`with${name[0].toUpperCase()}${name.slice(1)}`] = (
      ...args: any
    ) => UseComponent.with(fn(...args))
    ;(UseComponent as any)[`force${name[0].toUpperCase()}${name.slice(1)}`] = (
      ...args: any
    ) => UseComponent.with(fn(...args))
  })

  UseComponent.withDisplayName = (displayName: string) => {
    return InternalFactory<Context>([...stages], displayName)
  }

  return UseComponent as unknown as ModularComponent<Context>
}

function _ModularComponent<Props extends {} = {}, Ref = never>(
  displayName?: string,
) {
  return presets.default.withDisplayName(
    displayName as string,
  ) as ModularComponent<
    ApplyPreset<
      (
        ModularComponentPresets extends { default: infer C }
          ? C
          : typeof basePreset
      ) extends ModularComponent<infer U>
        ? U
        : never,
      Props,
      Ref
    >
  >
}

_ModularComponent.register = (
  functions: Partial<
    Record<
      keyof MapToRaw<ModularComponentStages<any>>,
      (...args: any[]) => (ctx?: ModularContext) => {
        field: string
        provide: (args: any) => any
      }
    >
  >,
) => {
  customFunctions = { ...customFunctions, ...functions }
}

_ModularComponent.preset = <
  Preset extends Exclude<
    keyof ModularComponentPresets,
    'register' | 'preset' | 'base'
  >,
>(
  preset: Preset,
  component: ModularComponentPresets[Preset],
) => {
  presets[preset] = component as any
  ;(_ModularComponent as any)[preset] = (displayName?: string) => {
    return presets[preset].withDisplayName(displayName as string)
  }
}

_ModularComponent.preset('default' as never, basePreset as never)
_ModularComponent.preset('base' as never, basePreset as never)

export const ModularComponent =
  _ModularComponent as typeof _ModularComponent & {
    [Preset in Exclude<
      keyof ModularComponentPresets,
      'register' | 'preset' | 'default'
    >]: <Props extends {} = {}, Ref = never>(
      displayName?: string,
    ) => ModularComponent<
      ApplyPreset<
        ModularComponentPresets[Preset] extends ModularComponent<infer U>
          ? U
          : never,
        Props,
        Ref
      >
    >
  }

export * from './render.js'
