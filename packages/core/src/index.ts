import React, {
  ForwardRefRenderFunction,
  FunctionComponent,
  PropsWithChildren,
} from 'react'

export interface ModularStage<
  Field extends string,
  Stage extends (args: any, ref?: any) => any,
> {
  field: Field
  useStage: Stage
}

export type FunctionComponentOrRefRenderFunction<Props, Ref> = [Ref] extends [
  never,
]
  ? FunctionComponent<PropsWithChildren<Props>>
  : ForwardRefRenderFunction<Ref, Props>

export type ModularComponent<
  Props extends {},
  Ref,
  Args extends { render: ReturnType<FunctionComponent> },
> = FunctionComponentOrRefRenderFunction<Props, Ref> & {
  with<Field extends string, Type>(stage: {
    field: Field
    useStage: (
      args: Args,
      ref: React.ForwardedRef<Ref>,
    ) => Field extends keyof Args ? Args[Field] : Type
  }): ModularComponent<
    Props,
    Ref,
    {
      [key in keyof Args | Field]: key extends 'render'
        ? ReturnType<FunctionComponent>
        : key extends Field
        ? Type
        : key extends keyof Args
        ? Args[key]
        : never
    }
  >
  force<Field extends string, Type>(stage: {
    field: Field
    useStage: (
      args: Args,
      ref: React.ForwardedRef<Ref>,
    ) => Field extends 'render' ? Args['render'] : Type
  }): ModularComponent<
    Props,
    Ref,
    {
      [key in keyof Args | Field]: key extends 'render'
        ? ReturnType<FunctionComponent>
        : key extends Field
        ? Type
        : key extends keyof Args
        ? Args[key]
        : never
    }
  >
  use<Field extends keyof Args>(
    key: Field,
  ): {} extends Props
    ? () => Args[Field]
    : (props: PropsWithChildren<Props>) => Args[Field]
  use(): {} extends Props
    ? () => Args
    : (props: PropsWithChildren<Props>) => Args
  stage<Field extends keyof Args>(
    key: Field,
  ): (args: Partial<Args>) => Args[Field]
  setDisplayName(displayName: string): ModularComponent<Props, Ref, Args>
}

function InternalFactory<
  Props extends {},
  Ref,
  Args extends { render: ReturnType<FunctionComponent> },
>(
  stages: ModularStage<
    string,
    (args: Args, ref: React.ForwardedRef<Ref>) => any
  >[],
): ModularComponent<Props, Ref, Args> {
  const useComponent = function (props: Props, ref: React.ForwardedRef<Ref>) {
    if (!stages.some((stage) => stage.field === 'render')) {
      stages = [...stages, render(() => null)]
    }
    return useComponent.use('render')(props, ref)
  }

  useComponent.with = (stage: ModularStage<string, (args: Args) => any>) => {
    const index = stages.findIndex((s) => s.field === stage.field)

    if (index !== -1) {
      const next = [...stages]
      next[index] = stage
      return InternalFactory<Props, Ref, Args>(next)
    }

    return InternalFactory<Props, Ref, Args>([...stages, stage])
  }
  useComponent.force = useComponent.with

  useComponent.use = (field: keyof Args) => {
    if (!field) {
      return (
        props: Props = {} as Props,
        ref: React.ForwardedRef<Ref> = null,
      ) => {
        const args: Record<string, any> = { props }
        for (let stage of stages) {
          args[stage.field] = stage.useStage(args as Args, ref)
        }
        return args
      }
    }

    const index = stages.findIndex((stage) => stage.field === field)
    const argStages =
      index === -1 ? stages.slice(0) : stages.slice(0, index + 1)

    return (
      props: Props = {} as Props,
      ref: React.ForwardedRef<Ref> = null,
    ) => {
      const args: Record<string, any> = { props }
      for (let stage of argStages) {
        args[stage.field] = stage.useStage(args as Args, ref)
      }
      return args[field as string]
    }
  }

  useComponent.stage = (field: keyof Args) => {
    const stage = stages.find((stage) => stage.field === field)
    return stage?.useStage ?? (() => null)
  }

  useComponent.setDisplayName = (displayName: string) => {
    ;(useComponent as any).displayName = displayName
  }

  return useComponent as unknown as ModularComponent<Props, Ref, Args>
}

export function ModularComponent<Props extends {} = {}, Ref = never>(
  displayName?: string,
): ModularComponent<
  Props,
  Ref,
  { props: Props; render: ReturnType<FunctionComponent> }
> {
  const useComponent = InternalFactory<
    Props,
    Ref,
    { props: Props; render: ReturnType<FunctionComponent> }
  >([])
  useComponent.displayName = displayName
  return useComponent
}

export function render<Args extends {}, Ref>(
  render: (
    args: Args,
    ref: React.ForwardedRef<Ref>,
  ) => React.ReactElement<any, any> | null,
): ModularStage<
  'render',
  (
    args: Args,
    ref: React.ForwardedRef<Ref>,
  ) => React.ReactElement<any, any> | null
> {
  return {
    field: 'render',
    useStage: render,
  }
}
