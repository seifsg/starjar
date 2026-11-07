import { mount } from 'svelte';
import { registerSW } from 'virtual:pwa-register';
import App from './App.svelte';
import './app.css';

// Boots the app and the offline service worker.
const target = document.getElementById('app');
if (!target) throw new Error('Starjar: #app element missing from index.html');
mount(App, { target });
registerSW({ immediate: true });
