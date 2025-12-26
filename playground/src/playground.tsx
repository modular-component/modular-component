import React from 'react'
import * as UI from '@mantine/core'

import { ModularComponent } from './modular'

const Loading = ModularComponent()
  .withLocale('components.Loading')
  .withRender(({ locale }) => (
    <UI.Text color="dimmed" align="center">
      {locale('loading')}
    </UI.Text>
  ))
const Disabled = ModularComponent()
  .withLocale('components.Disabled')
  .withRender(({ locale }) => (
    <UI.Text color="dimmed" align="center">
      {locale('disabled')}
    </UI.Text>
  ))

const useSharedLifecycle = ModularComponent()
  .withLifecycle(() => {
    const [loading, setLoading] = React.useState(true)

    return [loading, setLoading] as const
  })
  .use('lifecycle')

const Conditional = ModularComponent<{
  enabled?: boolean
  other?: boolean
}>()
  .withDefaultProps({ enabled: false })
  .withLocale('components.Conditional')
  .withComponents({ Loading, Disabled })
  .withLifecycle(() => {
    const [loading, setLoading] = useSharedLifecycle()

    React.useEffect(() => {
      if (loading) {
        const t = setTimeout(() => setLoading(false), 2500)
        return () => clearTimeout(t)
      }
    }, [loading])

    return { loading, reload: () => setLoading(true) }
  })
  .withCondition('disabled', ({ props }) => !props.enabled)
  .withConditionalFallback('disabled', ({ components }) => (
    <components.Disabled />
  ))
  .withCondition('loading', ({ lifecycle }) => lifecycle.loading)
  .withConditionalFallback('loading', ({ components }) => (
    <components.Loading />
  ))
  .withFragment('loadedFragment', ({ locale }) => (
    <UI.Text align="center">{locale('loaded')}</UI.Text>
  ))
  .withFragment('lastLoadedFragment', ({ locale, date }) => (
    <UI.Text align="center" color="dimmed">
      {locale('lastLoadedOn', { date: date.toISOString() })}
    </UI.Text>
  ))
  .withFragment('reloadFragment', ({ locale, lifecycle }) => (
    <UI.Button onClick={lifecycle.reload}>{locale('reload')}</UI.Button>
  ))
  .withConditionalRender(
    ({ loadedFragment, lastLoadedFragment, reloadFragment }) => (
      <UI.Stack>
        {loadedFragment}
        {lastLoadedFragment}
        {reloadFragment}
      </UI.Stack>
    ),
  )

const Unconditioned = Conditional.withLocale('components.Unconditioned')
  .withCondition('loading', () => false)
  .withConditionalRender(({ lifecycle, locale, reloadFragment, date }) => (
    <UI.Stack>
      <UI.Text align="center">{locale('noWait')}</UI.Text>
      {reloadFragment}
      <pre>{JSON.stringify({ lifecycle, date }, null, 2)}</pre>
    </UI.Stack>
  ))

const AlwaysLoadingLifecycle = Conditional.withLifecycle(() => ({
  hello: 'world',
  loading: true,
  reload: () => {},
}))

const AlwaysLoadingCond = Conditional.withCondition('loading', () => true)
const AlwaysDisabled = Conditional.withCondition('disabled', () => true)

export const App = ModularComponent<{ increment?: number; other?: string }>()
  .withDefaultProps({ increment: 2 })
  .withLifecycle(({ props }) => {
    const [count, setCount] = React.useState(0)
    const [enabled, setEnabled] = React.useState(true)

    const updateCount = () => setCount((c) => c + props.increment)
    const toggleEnabled = () => setEnabled((e) => !e)

    return { count, updateCount, enabled, toggleEnabled }
  })
  .withRender(({ lifecycle, props }) => (
    <UI.Stack my={32} mx="auto" sx={{ maxWidth: 640 }} spacing={64}>
      <UI.Title order={1} align="center">
        Modular Components Playground
      </UI.Title>

      <UI.Stack mx="auto">
        <UI.Badge size="xl">
          Count: <b>{lifecycle.count}</b>
        </UI.Badge>
        <UI.Button onClick={lifecycle.updateCount}>
          Increment by {props.increment}
        </UI.Button>
      </UI.Stack>

      <UI.Stack mx="auto">
        <UI.Switch
          checked={lifecycle.enabled}
          onClick={lifecycle.toggleEnabled}
          label="Toggle component"
        />

        <UI.Card withBorder>
          <Conditional enabled={lifecycle.enabled} />
        </UI.Card>

        <UI.Card withBorder>
          <Unconditioned enabled={lifecycle.enabled} />
        </UI.Card>

        <UI.Card withBorder>
          <AlwaysLoadingLifecycle enabled={lifecycle.enabled} />
        </UI.Card>

        <UI.Card withBorder>
          <AlwaysDisabled enabled={lifecycle.enabled} />
        </UI.Card>

        <UI.Card withBorder>
          <AlwaysLoadingCond enabled={lifecycle.enabled} />
        </UI.Card>
      </UI.Stack>
    </UI.Stack>
  ))
