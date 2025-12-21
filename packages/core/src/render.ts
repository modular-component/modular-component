import { FunctionComponent } from 'react'
import {
  addTo,
  wrap,
  ModularContext,
  GetValueGetterFor,
  StageParams,
  StageReturn,
} from './extend.js'

export function render<Context extends ModularContext>(
  useRender: GetValueGetterFor<
    Context,
    'render',
    ReturnType<FunctionComponent>
  >,
) {
  return addTo<Context>().on('render').provide(wrap(useRender))
}

export type WithRender<Context extends ModularContext> = (
  ...args: StageParams<typeof render<Context>>
) => StageReturn<typeof render<Context>>
