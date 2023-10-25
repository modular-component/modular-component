import React from 'react'
import * as UI from '@mantine/core'

import * as Modular from './modular'

const Loading = () => (
  <UI.Text color="dimmed" align="center">
    Loading...
  </UI.Text>
)
const Disabled = () => (
  <UI.Text color="dimmed" align="center">
    Disabled.
  </UI.Text>
)

const useSharedLifecycle = Modular.Component()
  .with(
    Modular.lifecycle(() => {
      const [loading, setLoading] = React.useState(true)

      return [loading, setLoading] as const
    }),
  )
  .use('lifecycle')

const Conditional = Modular.Component<{
  enabled?: boolean
  other?: boolean
}>()
  .with(Modular.date())
  .with(Modular.defaultProps({ enabled: false }))
  .with(Modular.locale('components.Conditional'))
  .with(Modular.components({ Loading, Disabled }))
  .with(
    Modular.lifecycle(() => {
      const [loading, setLoading] = useSharedLifecycle()

      React.useEffect(() => {
        if (loading) {
          setTimeout(() => setLoading(false), 2500)
        }
      }, [loading])

      return { loading, reload: () => setLoading(true) }
    }),
  )
  .with(Modular.condition('loading', ({ lifecycle }) => lifecycle.loading))
  .with(Modular.condition('disabled', ({ props }) => !props.enabled))
  .with(
    Modular.conditionalFallback('loading', ({ components }) => (
      <components.Loading />
    )),
  )
  .with(
    Modular.conditionalFallback('disabled', ({ components }) => (
      <components.Disabled />
    )),
  )
  .with(
    Modular.conditionalRender(({ lifecycle, date, locale }) => (
      <UI.Stack>
        <UI.Text align="center">{locale('loaded')}</UI.Text>
        <UI.Text align="center" color="dimmed">
          {locale('lastLoadedOn', { date: date.toISOString() })}
        </UI.Text>
        <UI.Button onClick={lifecycle.reload}>{locale('reload')}</UI.Button>
      </UI.Stack>
    )),
  )

const Unconditioned = Conditional.with(
  Modular.locale('components.Unconditioned'),
)
  .with(Modular.condition('loading', () => false))
  .with(
    Modular.conditionalRender(({ lifecycle, locale }) => (
      <UI.Stack>
        <UI.Text align="center">{locale('noWait')}</UI.Text>
        <UI.Button onClick={lifecycle.reload}>{locale('reload')}</UI.Button>
        <pre>{JSON.stringify({ lifecycle }, null, 2)}</pre>
      </UI.Stack>
    )),
  )

const AlwaysLoadingLifecycle = Conditional.with(
  Modular.lifecycle(() => ({
    hello: 'world',
    loading: true,
    reload: () => {},
  })),
)

const AlwaysLoadingCond = Conditional.with(
  Modular.condition('loading', () => true),
)
const AlwaysDisabled = Conditional.with(
  Modular.condition('disabled', () => true),
)

export const App = Modular.Component<{ increment?: number }>()
  .with(Modular.defaultProps({ increment: 2 }))
  .with(
    Modular.lifecycle(({ props }) => {
      const [count, setCount] = React.useState(0)
      const [enabled, setEnabled] = React.useState(true)

      const updateCount = () => setCount((c) => c + props.increment)
      const toggleEnabled = () => setEnabled((e) => !e)

      return { count, updateCount, enabled, toggleEnabled }
    }),
  )
  .with(
    Modular.render(({ lifecycle, props }) => (
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
    )),
  )
