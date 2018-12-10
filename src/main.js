import App from './App.html';
import store from './store.js';

const app = new App({
	target: document.body,
	store
});

if (window.localStorage.getItem('toggle:items')) {
    const items = JSON.parse(window.localStorage.getItem('toggle:items'));

	store.set({ items });
}
export default app;
