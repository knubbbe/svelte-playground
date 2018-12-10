import { Store } from 'svelte/store.js';
import { uniqueId } from './utils/helpers.js';

const storage = window.localStorage;

class ItemStore extends Store {
    /**
     * Add an item to ItemStore
     * @param {Object} payload { title, ...rest }
     */
	addItem({ title }) {
        const now = Date.now();
        const item = {
            _id: uniqueId(),
            title: title,
            sessions: [
                {
                    start: now,
                    end: now
                }
            ],
            interval: null
        };
        const items = [item].concat(this.get().items);

        this.set({ items });
	}

    /**
     * Remove item from ItemStore
     * @param {String} id
     */
	removeItem(id) {
        const items = this.get().items.filter(i => i._id !== id);

        this.set({ items });
    }

    /**
     * Resume an item timer
     * @param {String} id
     */
    resumeItem(id) {
        const items = this.get().items.map(item => {
            if (item._id === id) {
                item.sessions.push({
                    start: Date.now(),
                    end: Date.now()
                });

                item.interval = setInterval(() => this.updateEndTime(id), 1000);
            }

            return item;
        });

        this.set({ items });
    }

    /**
     * Pause an item timer
     * @param {String} id
     */
    pauseItem(id) {
        const items = this.get().items.map(item => {
            if (item._id === id) {
                clearInterval(item.interval);
                item.interval = null;
            }

            return item;
        });

        this.set({ items });
    }

    /**
     * Updates end time on item to current unix time
     * @param {String} id
     */
    updateEndTime(id) {
        console.log('UPDATING', id);

        const items = this.get().items.map(item => {
            if (item._id === id) {
                item.sessions[item.sessions.length - 1].end = Date.now();
            }

            return item;
        });

        this.set({ items });
    }
}

const store = new ItemStore({
	items: []
});

store.on('state', ({ current }) => {
    storage.setItem('toggle:items', JSON.stringify(current.items));
});

window.store = store; // For debugging

export default store;
