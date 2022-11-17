import { ModularStages } from './stage'

export type ValidateIndex<
  Index extends number | undefined,
  Candidates extends string | number,
> = `${Index}` extends Candidates ? true : false

export type RestrictValue<
  Arguments extends {},
  Stage extends keyof ModularStages,
> = ModularStages<Arguments>[Stage]['restrict'] extends never
  ? unknown
  : ModularStages<Arguments>[Stage]['restrict']
