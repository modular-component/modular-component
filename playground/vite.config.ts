import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@modular-component/core': '@modular-component/core/src/index',
      '@modular-component/default': '@modular-component/default/src/index',
      '@modular-component/with-components':
        '@modular-component/with-components/src/index',
      '@modular-component/with-conditional-render':
        '@modular-component/with-conditional-render/src/index',
      '@modular-component/with-default-props':
        '@modular-component/with-default-props/src/index',
      '@modular-component/with-lifecycle':
        '@modular-component/with-lifecycle/src/index',
    },
  },
})
