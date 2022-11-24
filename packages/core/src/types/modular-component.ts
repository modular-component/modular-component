/**
 * Main ModularComponent type
 */

import { ForwardedRef, FunctionComponent, PropsWithChildren } from 'react'

import { StageTuple } from './stage'
import { MethodRecord } from './methods'
import { ModularWithMethods } from './methods/with'
import { ModularAddMethods } from './methods/add'
import { ModularAtMethods } from './methods/at'
import { ModularBeforeMethods } from './methods/before'
import { ModularMockMethods } from './methods/mock'
import { ModularHookMethods } from './methods/hook'

export type ModularComponent<
  Props extends {},
  Ref,
  Methods extends Record<string, MethodRecord>,
  Stages extends StageTuple,
> = ModularWithMethods<Props, Ref, Methods, Stages> &
  ModularAddMethods<Props, Ref, Methods, Stages> &
  ModularAtMethods<Props, Ref, Methods, Stages> &
  ModularBeforeMethods<Props, Ref, Methods, Stages> &
  ModularMockMethods<Props, Ref, Methods, Stages> &
  ModularHookMethods<Props, Ref, Methods, Stages> &
  FunctionComponent<PropsWithChildren<Props & { ref?: ForwardedRef<Ref> }>>
