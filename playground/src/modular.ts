import { modularFactory } from '@modular-component/core'
import { WithDefaultStages } from '@modular-component/default'
import { WithComponents } from '@modular-component/with-components'
import { WithConditionalRender } from '@modular-component/with-conditional-render'

import { useTranslation } from 'react-i18next'
import { TFunction, TFuncKey } from 'i18next'

import './i18n'

const withLocale = Symbol()
const withDate = Symbol()

declare module '@modular-component/core' {
  export interface ModularStages<Args, Value> {
    [withLocale]: {
      transform: TFunction<'translation', Value>
      validate: (key: TFuncKey<'translation', Value>) => string
      restrict?: TFuncKey
    }
    [withDate]: {
      restrict: undefined
      transform: Date
    }
  }
}

export const ModularComponent = modularFactory
  .extend(WithDefaultStages)
  .extend(WithComponents)
  .extend(WithConditionalRender)
  .extend({
    Locale: {
      symbol: withLocale,
      field: 'locale',
      transform: <A, P>(args: A, useKey: P) => {
        const key = typeof useKey === 'function' ? useKey(args) : useKey

        return useTranslation('translation', { keyPrefix: key }).t
      },
    },
    Date: {
      symbol: withDate,
      field: 'date',
      transform: () => new Date(),
    },
  })
  .build()
