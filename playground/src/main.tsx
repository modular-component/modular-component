import React from 'react'
import ReactDOM from 'react-dom/client'

import { MantineProvider } from '@mantine/core'
import i18n from './i18n'
import { I18nextProvider } from 'react-i18next'

import { App } from './playground'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <I18nextProvider i18n={i18n}>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  </I18nextProvider>,
)
