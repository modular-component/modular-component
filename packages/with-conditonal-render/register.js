import { ModularComponent } from '@modular-component/core'
import {
  condition,
  conditionalFallback,
  conditionalRender,
} from '@modular-component/with-conditional-render'

ModularComponent.register({ condition, conditionalFallback, conditionalRender })
