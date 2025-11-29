import { ModularComponent, ModularContext } from '@modular-component/core'
import {
  addTo,
  AppendStage,
  GetConstraintFor,
  StageParams,
  StageReturn,
} from '@modular-component/core/extend'
import '@modular-component/default/register'
import '@modular-component/with-components/register'
import '@modular-component/with-fragment/register'
import '@modular-component/with-conditional-render/register'

import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { en } from './i18n'

// Locale
type DotNotationKeys<T, P extends string = ''> = {
  [key in keyof T]: T[key] extends Record<string, unknown>
    ?
        | DotNotationKeys<
            T[key],
            key extends string ? (P extends '' ? key : `${P}.${key}`) : ''
          >
        | (key extends string ? (P extends '' ? key : `${P}.${key}`) : '')
    : key extends string
    ? P extends ''
      ? key
      : `${P}.${key}`
    : ''
}[keyof T] extends infer U
  ? U
  : never

type ExtractKeys<
  Keys extends string,
  Prefix extends string,
> = Keys extends `${Prefix}.${infer S extends string}` ? S : never

type Keys = DotNotationKeys<typeof en>

type ConstrainedTFunction<Key extends string> =
  | TFunction<'translation', Key>
  | ((key: ExtractKeys<Keys, Key>) => string)

type LocaleType<Context extends ModularContext> = {
  [key in Keys]: ConstrainedTFunction<key> extends GetConstraintFor<
    Context,
    'locale'
  >
    ? key
    : never
}[Keys] extends infer U extends string
  ? U
  : never

function locale<
  Context extends ModularContext,
  Key extends LocaleType<Context>,
>(key: Key) {
  return addTo<Context>()
    .on('locale')
    .provide(
      (): ConstrainedTFunction<Key> =>
        useTranslation('translation', { keyPrefix: key as Keys }).t,
    )
}

type WithLocale<Context extends ModularContext> = <
  Key extends LocaleType<Context>,
>(
  ...args: StageParams<typeof locale<Context, Key>>
) => StageReturn<typeof locale<Context, Key>>

// Date
function date<Context extends ModularContext>() {
  return addTo<Context>()
    .on('date')
    .provide(() => new Date())
}

type WithDate<Context extends ModularContext> = (
  ...args: StageParams<typeof date<Context>>
) => StageReturn<typeof date<Context>>

// Augment
ModularComponent.register({
  date,
  locale,
})
declare module '@modular-component/stages' {
  export interface ModularComponentStages<Context extends ModularContext> {
    withDate: WithDate<Context>
    withLocale: WithLocale<Context>
  }
}

export { ModularComponent }
