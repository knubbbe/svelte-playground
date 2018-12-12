import * as Sentry from '@sentry/browser';

const debounce = (func, wait, immediate) => {
    let timeout;

	return function() {
		const context = this, args = arguments;
		const later = () => {
			timeout = null;
			if (!immediate) {
                func.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
	};
};

const keyEvent = (code) => {
    return function(node, callback) {
        function keydownHandler (event) {
            if (event.which === code) callback.call(this, event);
        }
        node.addEventListener('keydown', keydownHandler, false);

        return {
            destroy() {
                node.removeEventListener('keydown', keydownHandler, false);
            }
        };
    };
};

const uniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};

const calculateSessionTime = (sessions) => {
    try {
        let delta = sessions.reduce((res, row) => {
            const diff = Math.abs(row.end - row.start) / 1000;

            if (typeof res === 'number') {
                return res + diff;
            }

            return diff;
        });

        if (typeof delta === 'object') {
            delta = Math.abs(delta.end - delta.start) / 1000;
        }

        const hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        const minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        const seconds = parseInt(delta % 60);

        return {
            hours: (`${hours}`.length < 2) ? `0${hours}` : hours,
            minutes: (`${minutes}`.length < 2) ? `0${minutes}` : minutes,
            seconds: (`${seconds}`.length < 2) ? `0${seconds}` : seconds
        }
    } catch(err) {
        Sentry.captureException(err);
    }
};

const redmine = async endpoint => {
    const key = 'af52ac40cbfd3f8c1bf7cb9930fb10bfc3f4a0d2';
    const apiKey = (endpoint.indexOf('?') !== -1)
        ? `&key=${key}`
        : `?key=${key}`;
    let req, res;

    try {
        req = await fetch(
            `https://redmine.westart.se${endpoint}${apiKey}`,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    // 'X-Redmine-API-Key': 'af52ac40cbfd3f8c1bf7cb9930fb10bfc3f4a0d2',
                    // credentials: 'include',
                    // mode: 'cors'
                },
            }
        );
    } catch(err) {
        console.log('Redmine Request error:', err);
        Sentry.captureException('Redmine search', err);
    }

    try {
        res = await req.json();
    } catch(err) {
        console.log('Redmine json error', err);
        Sentry.captureException('Redmine search', err);
    }

    return res;
};

export {
    debounce,
    keyEvent,
    uniqueId,
    calculateSessionTime,
    redmine
};
