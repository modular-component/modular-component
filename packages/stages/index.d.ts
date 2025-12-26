export type ModularContext = {
  arguments: Record<string, any>
  constraints: Record<string, any>
  _constraints?: Record<string, any>
  stages: Record<string, string>
  props: any
  ref: any
}

export interface ModularComponentStages<Context extends ModularContext> {}

export interface ModularComponentPresets {
  register: 'Error: cannot create a preset called "register"'
  preset: 'Error: cannot create a preset called "preset"'
}
