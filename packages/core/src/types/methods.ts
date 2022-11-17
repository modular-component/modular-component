/**
 * Helper types for handling method records
 */

import { ModularStages } from './stage'

export type MethodRecord = {
  symbol: keyof ModularStages
  field: string
  transform?: (args: any, value: any) => any
}
