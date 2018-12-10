import App from './App.html';
import { Store } from 'svelte/store.js';

const store = new Store({
	items: []
});

const app = new App({
	target: document.body,
	store
});

if (window.localStorage.getItem('toggle:items')) {
	store.set({ items: JSON.parse(window.localStorage.getItem('toggle:items')) });
}

window.store = store;

export default app;
