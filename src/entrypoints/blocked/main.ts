import { mount } from 'svelte';
import App from '@/entrypoints/blocked/App.svelte';
import '@/assets/tailwind.css';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
