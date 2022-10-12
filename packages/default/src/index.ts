import { WithDefaultProps } from '@modular-component/with-default-props'
import { WithLifecycle } from '@modular-component/with-lifecycle'

export const WithDefaultStages = {
  ...WithDefaultProps,
  ...WithLifecycle,
}
