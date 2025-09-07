import { mount } from 'svelte';
import App from '@/entrypoints/sidepanel/App.svelte';
import '@/entrypoints/sidepanel/app.css';
import '@/assets/tailwind.css';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
