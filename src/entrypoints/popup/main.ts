import { mount } from 'svelte';
import App from '@/entrypoints/popup/App.svelte';
import '@/entrypoints/popup/app.css';
import '@/assets/tailwind.css';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
