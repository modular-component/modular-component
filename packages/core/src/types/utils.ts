/**
 * Generic type helpers (tuple, union, object...)
 */

// Tuple handling
export type OneLess<Tuple extends unknown[]> = Tuple extends [
  unknown,
  ...infer Rest,
]
  ? Rest
  : Tuple
export type Before<
  Tuple extends unknown[],
  Index extends string | number,
> = `${Tuple['length']}` extends `${Index}`
  ? Tuple
  : Tuple extends [...infer Keep, infer Drop]
  ? Before<Keep, Index>
  : never
export type After<
  Tuple extends unknown[],
  Index extends string | number,
  Rest extends unknown[] = [],
> = `${Rest['length']}` extends `${Index}`
  ? Tuple
  : Tuple extends [infer Drop, ...infer Keep]
  ? After<Keep, Index, [...Rest, Drop]>
  : never
export type At<
  Tuple extends unknown[],
  Index extends string | number,
> = `${OneLess<Tuple>['length']}` extends `${Index}`
  ? Tuple
  : Tuple extends [...infer Keep, infer Drop]
  ? At<Keep, Index>
  : never
export type Reduce<T extends unknown[]> = T extends [...infer R, infer L]
  ? [L] extends [never]
    ? [...Reduce<R>]
    : [...Reduce<R>, L]
  : T
export type ToIndices<T extends unknown[]> = { [key in keyof T]: key }[number]
export type Last<T extends unknown[]> = T extends [...infer R, infer L]
  ? L
  : never

// Union handling

// Collapse a union of similar object into the intersection of the various objects
export type UnionToIntersection<U> = [U] extends [never]
  ? never
  : (U extends infer V ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

// Object handling
type NonNeverKeys<Obj extends {}> = {
  [key in keyof Obj]: Obj[key] extends never ? never : key
}[keyof Obj]

export type FilterNever<Obj extends {}> = {
  [key in NonNeverKeys<Obj>]: Obj[key]
}
