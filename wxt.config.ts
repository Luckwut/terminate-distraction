import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    action: {},
    permissions: ['storage', 'tabs', 'scripting', 'webNavigation'],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
