import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@modular-component/core/extend': '@modular-component/core/src/extend',
      '@modular-component/core/register': '@modular-component/core/register',
      '@modular-component/core/register.js':
        '@modular-component/core/register.js',
      '@modular-component/core': '@modular-component/core/src/index',
      '@modular-component/with-components/register':
        '@modular-component/with-components/register',
      '@modular-component/with-components/register.js':
        '@modular-component/with-components/register.js',
      '@modular-component/with-components':
        '@modular-component/with-components/src/index',
      '@modular-component/with-conditional-render/register':
        '@modular-component/with-conditional-render/register',
      '@modular-component/with-conditional-render/register.js':
        '@modular-component/with-conditional-render/register.js',
      '@modular-component/with-conditional-render':
        '@modular-component/with-conditional-render/src/index',
      '@modular-component/with-default-props/register':
        '@modular-component/with-default-props/register',
      '@modular-component/with-default-props/register.js':
        '@modular-component/with-default-props/register.js',
      '@modular-component/with-default-props':
        '@modular-component/with-default-props/src/index',
      '@modular-component/with-lifecycle/register':
        '@modular-component/with-lifecycle/register',
      '@modular-component/with-lifecycle/register.js':
        '@modular-component/with-lifecycle/register.js',
      '@modular-component/with-lifecycle':
        '@modular-component/with-lifecycle/src/index',
      '@modular-component/with-fragment/register':
        '@modular-component/with-fragment/register',
      '@modular-component/with-fragment/register.js':
        '@modular-component/with-fragment/register.js',
      '@modular-component/with-fragment':
        '@modular-component/with-fragment/src/index',
    },
  },
})
