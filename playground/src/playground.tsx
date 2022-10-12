import React from 'react'
import * as UI from '@mantine/core'

import { ModularComponent } from './modular'

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

const useSharedLifecycle = ModularComponent()
  .withLifecycle(() => {
    const [loading, setLoading] = React.useState(true)

    return [loading, setLoading] as const
  })
  .asHook('lifecycle')

const Conditional = ModularComponent<{ enabled?: boolean; other?: boolean }>()
  .withDate()
  .withDebug()
  .withDefaultProps({ enabled: false })
  .withDebug()
  .withComponents({ Loading, Disabled })
  .withDebug((args) => console.error(args))
  .withCondition(({ props }) => props.enabled)
  .withDebug()
  .withConditionalFallback(({ components }) => <components.Disabled />)
  .withDebug()
  .withLifecycle(() => {
    const [loading, setLoading] = useSharedLifecycle()

    React.useEffect(() => {
      if (loading) {
        setTimeout(() => setLoading(false), 2500)
      }
    }, [loading])

    return { loading, reload: () => setLoading(true) }
  })
  .withDebug()
  .withCondition(({ lifecycle }) => !lifecycle.loading)
  .withDebug()
  .withConditionalFallback(({ components }) => <components.Loading />)
  .withDebug()
  .withConditionalRender(({ lifecycle, date }) => (
    <UI.Stack>
      <UI.Text align="center">Loaded!</UI.Text>
      <UI.Text align="center" color="dimmed">
        Last loaded on {date.toISOString()}
      </UI.Text>
      <UI.Button onClick={lifecycle.reload}>Reload</UI.Button>
    </UI.Stack>
  ))

const Unconditioned = Conditional.atStage(
  'withLifecycle',
).withConditionalRender(({ lifecycle }) => (
  <UI.Stack>
    <UI.Text align="center">Loaded without waiting!</UI.Text>
    <UI.Button onClick={lifecycle.reload}>Reload</UI.Button>
    <pre>{JSON.stringify({ lifecycle }, null, 2)}</pre>
  </UI.Stack>
))

export const App = ModularComponent<{ increment?: number }>()
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
      </UI.Stack>
    </UI.Stack>
  ))
