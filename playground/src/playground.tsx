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
  .asUseLifecycle()

const Conditional = ModularComponent<
  { enabled?: boolean; other?: boolean },
  HTMLDivElement
>()
  .withDate()
  .withDefaultProps({ enabled: false })
  .withLocale('components.Conditional')
  .withComponents({ Loading, Disabled })
  .withCondition(({ props }) => props.enabled)
  .withConditionalFallback(({ components }) => <components.Disabled />)
  .withLifecycle(({ condition, props }) => {
    const [loading, setLoading] = useSharedLifecycle()

    React.useEffect(() => {
      if (loading) {
        setTimeout(() => setLoading(false), 2500)
      }
    }, [loading])

    return { loading, reload: () => setLoading(true) }
  })
  .addCondition(({ lifecycle }) => !lifecycle.loading)
  .addConditionalFallback(({ components }) => <components.Loading />)
  .withConditionalRender(({ lifecycle, date, locale }) => (
    <UI.Stack>
      <UI.Text align="center">{locale('loaded')}</UI.Text>
      <UI.Text align="center" color="dimmed">
        {locale('lastLoadedOn', { date: date.toISOString() })}
      </UI.Text>
      <UI.Button onClick={lifecycle.reload}>{locale('reload')}</UI.Button>
    </UI.Stack>
  ))

const Unconditioned = Conditional.atLifecycle()
  .withLocale('components.Unconditioned')
  .withConditionalRender(({ lifecycle, locale }) => (
    <UI.Stack>
      <UI.Text align="center">{locale('noWait')}</UI.Text>
      <UI.Button onClick={lifecycle.reload}>{locale('reload')}</UI.Button>
      <pre>{JSON.stringify({ lifecycle }, null, 2)}</pre>
    </UI.Stack>
  ))

const AlwaysLoading = Conditional.withLifecycle(() => ({
  hello: 'world',
  loading: true,
  reload: () => {},
}))

const AlwaysLoadingMock = Conditional.mockLifecycle({
  loading: true,
  reload: () => {},
})

const AlwaysLoadingCond = Conditional.mockCondition(true, 0).mockCondition(
  false,
  1,
)
const AlwaysDisabled = Conditional.mockCondition(false, 0)

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

        <UI.Card withBorder>
          <AlwaysLoading enabled={lifecycle.enabled} />
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
