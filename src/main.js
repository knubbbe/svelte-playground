import * as Sentry from '@sentry/browser';
import App from './App.html';
import store from './store.js';


Sentry.init({ dsn: 'https://ffcd4a3639b14f82aae824e33fbd146b@sentry.io/1341813' });

const app = new App({
	target: document.body,
	store
});

try {
	if (window.localStorage.getItem('toggle:items')) {
		const items = JSON.parse(window.localStorage.getItem('toggle:items'));

		store.set({ items });
	}

	store.checkForOnGoingSessions();
} catch(err) {
	Sentry.captureException(err);
}

export default app;
