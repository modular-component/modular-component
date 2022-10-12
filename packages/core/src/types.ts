import { FunctionComponent } from 'react'

// Collapse a union of similar object into the intersection of the various objects
type UnionToIntersection<U> = [U] extends [never]
  ? never
  : (U extends infer V ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

// Base types used for manipulating stages
export type StageEntry = { key: MethodName; value: unknown; stages: string }
type StageList = StageEntry[]

// Base type used for manipulating methods
export type MethodName = `with${Capitalize<string>}`
export type MethodEntry = {
  field: string
  transform?: (args: any, value: any) => any
  restrict?: unknown
  multiple?: boolean
  empty?: boolean
}
export type MethodRecord = Record<MethodName, MethodEntry>

// Take a stage list, and append a new stage at the end
type AppendStage<
  List extends StageList,
  Stage extends MethodName,
  Value extends unknown,
  Prev extends StageEntry = GetStage<List, Stage>,
> = [
  ...List,
  {
    key: Stage
    value: Value
    stages: [Prev] extends [never] ? List[number]['key'] : Prev['stages']
  },
]

// Take a stage list, and remove all stages matching a set of keys
type DropStages<List extends StageList, Dropped extends string> = {
  [Index in keyof List]: List[Index]['key'] extends Dropped
    ? never
    : List[Index]
}

// Take a stage list, and keep only the stages matching a set of keys
type KeepStages<List extends StageList, Allowed extends string> = {
  [Index in keyof List]: List[Index]['key'] extends Allowed
    ? List[Index]
    : never
}

// Parse a stage list to extract all the stages matching a key
type GetStage<
  List extends StageList,
  Key extends MethodName,
  Union = List[number],
> = Union extends { key: Key; value: infer U; stages: infer S }
  ? { key: Key; value: U; stages: S }
  : never

// Parse a stage list to extract the collapsed value for a given stage key
type GetStageValue<
  List extends StageList,
  Key extends MethodName,
> = UnionToIntersection<GetStage<List, Key>['value']>

// Collapse a complete stage list into an argument object
// Use the deep `extends infer U` method to get a clean object in tooltips
type ComputeArgs<
  Stages extends StageList,
  Limit extends string,
  Union = Stages[number],
  Intersection = UnionToIntersection<
    Union extends { key: infer Key; value: infer Value }
      ? { [key in Key extends string ? Key : never]: Value }
      : never
  >,
> = Pick<
  Intersection,
  Limit extends keyof Intersection ? Limit : never

  // Deeply spread the object for cleaner type tooltips
> extends infer U
  ? {
      [key in keyof U]: U[key] extends Record<string, unknown>
        ? U[key] extends infer V
          ? { [key in keyof V]: V[key] }
          : never
        : U[key]
    }
  : never

// Check if a custom transform exists for the given argument, and apply
// it to the current value if there is
type TransformArg<Value, Key> = Key extends keyof ModularStageTransform<Value>
  ? ModularStageTransform<Value>[Key]
  : Value

// Map all computed arguments against the methods map to convert
// from the stage key to the wanted field name
// Use the deep `extends infer U` method to get a clean object in tooltips
type MapArgs<
  Stages extends StageList,
  Limit extends string,
  Methods extends MethodRecord,
  Props,
  Args = ComputeArgs<Stages, Limit>,
> = UnionToIntersection<
  // Start by injecting the original props
  | { props: Props }
  // Map over all configured methods
  | {
      [key in keyof Methods]: key extends keyof Args // Check if an arg exists for the given method
        ? Methods[key] extends MethodEntry
          ? {
              // Extract the field name from the method
              [k in Methods[key]['field']]: TransformArg<Args[key], key>
            }
          : never
        : // Set to never if the arg does not exist
          never
    }[keyof Methods]

  // Deeply spread the object for cleaner type tooltips
> extends infer U
  ? {
      [key in keyof U]: U[key] extends Record<string, unknown>
        ? U[key] extends infer V
          ? { [key in keyof V]: V[key] }
          : never
        : U[key]
    }
  : never

type ModularExtension<
  Props,
  Methods extends MethodRecord,
  Stages extends StageList,
> = {
  [key in keyof Methods]: (Methods[key] extends MethodEntry
    ? Methods[key]
    : never)['restrict'] extends undefined
    ? <
        // Cast the method key to a method name
        Key extends key extends MethodName ? key : never,
        // Extract the current method
        Method extends Methods[Key] extends MethodEntry ? Methods[Key] : never,
        // If the mode is not 'multiple', get any previous value used
        // for the stage
        Prev extends Method['multiple'] extends true
          ? never
          : GetStageValue<Stages, Key>,
        // Find the stages occurring before the first instance of the current
        // stage, in order to limit the arguments to those defined before the
        // stage. This is needed for 'single' mode stages that are called
        // multiple time.
        Limit extends Method['multiple'] extends true // Ignore for 'multiple' stages
          ? Stages[number]['key']
          : [GetStage<Stages, Key>] extends [never] // Ignore if it's the first time we see the stage
          ? Stages[number]['key']
          : GetStage<Stages, Key>['stages'],
        // Compute the kept stages by dropping all references to current stage
        // for multiple mode, or keeping all previous stages for single mode
        KeptStages extends Method['multiple'] extends true
          ? DropStages<Stages, Key>
          : Stages,
        // Get the value to use or infer, restricting it to any
        // configured restriction or previously used values
        Value extends [Prev] extends [never]
          ? [Method['restrict']] extends [never]
            ? unknown
            : Method['restrict']
          : Prev,
      >(
        // A stage accepts either a direct value or a function (hook) generating the value
        value?:
          | Value
          | ((args: MapArgs<Stages, Limit, Methods, Props>) => Value | void),
      ) => Modular<Props, Methods, AppendStage<KeptStages, Key, Value>>
    : <
        // Cast the method key to a method name
        Key extends key extends MethodName ? key : never,
        // Extract the current method
        Method extends Methods[Key] extends MethodEntry ? Methods[Key] : never,
        // If the mode is not 'multiple', get any previous value used
        // for the stage
        Prev extends Method['multiple'] extends true
          ? never
          : GetStageValue<Stages, Key>,
        // Find the stages occurring before the first instance of the current
        // stage, in order to limit the arguments to those defined before the
        // stage. This is needed for 'single' mode stages that are called
        // multiple time.
        Limit extends Method['multiple'] extends true // Ignore for 'multiple' stages
          ? Stages[number]['key']
          : [GetStage<Stages, Key>] extends [never] // Ignore if it's the first time we see the stage
          ? Stages[number]['key']
          : GetStage<Stages, Key>['stages'],
        // Compute the kept stages by dropping all references to current stage
        // for multiple mode, or keeping all previous stages for single mode
        KeptStages extends Method['multiple'] extends true
          ? DropStages<Stages, Key>
          : Stages,
        // Get the value to use or infer, restricting it to any
        // configured restriction or previously used values
        Value extends [Prev] extends [never]
          ? [Method['restrict']] extends [never]
            ? unknown
            : Method['restrict']
          : Prev,
      >(
        // A stage accepts either a direct value or a function (hook) generating the value
        value:
          | Value
          | ((args: MapArgs<Stages, Limit, Methods, Props>) => Value),
      ) => Modular<Props, Methods, AppendStage<KeptStages, Key, Value>>
} & {
  // Create a new component using the same stages as the current component
  // up to a certain point
  atStage<
    // Key of the stage to keep to
    Key extends Stages[number]['key'],
    // List of stages up to the one referenced by the key
    KeptStages extends KeepStages<
      Stages,
      GetStage<Stages, Key>['stages'] | Key
    >,
  >(
    stage: Key,
  ): Modular<Props, Methods, KeptStages>
  // Generate a hook instead of a component, returning the generated arguments
  asHook(): Props extends {}
    ? () => MapArgs<Stages, Stages[number]['key'], Methods, Props>
    : (props: Props) => MapArgs<Stages, Stages[number]['key'], Methods, Props>
  // Overload the asHook function to allow taking in a field from the generated arguments,
  // and returning only the value from this field
  asHook<
    Field extends keyof MapArgs<Stages, Stages[number]['key'], Methods, Props>,
  >(
    field: Field,
  ): Props extends {}
    ? () => MapArgs<Stages, Stages[number]['key'], Methods, Props>[Field]
    : (
        props: Props,
      ) => MapArgs<Stages, Stages[number]['key'], Methods, Props>[Field]
}

// Type used for describing a ModularComponent. In essence, it is a FunctionComponent
// with all the factories methods appended.
// In this type, we strongly-type all factory methods and the enhanced returned component
// by keeping track of all the previous stages through a stage-list tuple
export type Modular<
  // The props are set and are invariant for the component, but the `props` argument
  // itself can be extended
  Props,
  // List of all methods available for the component, won't change as the component
  // is built but depends on the factory that started the build
  Methods extends MethodRecord,
  // Finally, the list of stages that will be appended as methods are called
  Stages extends StageList,
> =
  // At its core, the ModularComponent is a normal FunctionComponent taking
  // the original props, extended with additional methods
  FunctionComponent<Props> & ModularExtension<Props, Methods, Stages>

/* Exposed interfaces used for extending functionality */

// Add a value transformation for a given stage. The T type is the
// original type of the value passed to the stage.
export interface ModularStageTransform<T> {}
