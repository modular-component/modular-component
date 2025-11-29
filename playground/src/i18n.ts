import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const en = {
  components: {
    Loading: {
      loading: 'Loading...',
    },
    Disabled: {
      disabled: 'Disabled.',
    },
    Conditional: {
      loaded: 'Loaded!',
      lastLoadedOn: 'Last loaded on {{date}}',
      reload: 'Reload',
    },
    Unconditioned: {
      loaded: 'Loaded!',
      lastLoadedOn: 'Last loaded on {{date}}',
      noWait: 'Loaded without waiting!',
      reload: 'Reload',
    },
  },
}

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: en,
    },
  },
})

export default i18n

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en
    }
  }
}
