import { ModularStage } from '@modular-component/core'

import { useTranslation } from 'react-i18next'
import type { TFuncKey, TFunction } from 'i18next'

import './i18n'

export { ModularComponent as Component } from '@modular-component/core'
export { components } from '@modular-component/with-components'
export * from '@modular-component/with-conditional-render'
export * from '@modular-component/default'

export function locale<Key extends TFuncKey<'translation'> = never>(
  key?: Key,
): ModularStage<
  'locale',
  () => [Key] extends [never]
    ? TFunction<'translation'>
    :
        | TFunction<'translation', Key>
        | ((key: TFuncKey<'translation', Key>) => string)
> {
  return {
    field: 'locale',
    useStage: () => useTranslation('translation', { keyPrefix: key }).t,
  }
}

export function date(): ModularStage<'date', () => Date> {
  return { field: 'date', useStage: () => new Date() }
}
