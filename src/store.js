import { Store } from 'svelte/store.js';
import { startTimer, uniqueId } from './utils/helpers.js';

const storage = window.localStorage;

class ItemStore extends Store {
    /**
     * Add an item to ItemStore
     * @param {Object} payload { title, ...rest }
     */
	addItem({ title }) {
        /** For testing purposes */
        // const randomNumber = Math.floor(Math.random() * 15) + 1;

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

    resumeItem(id) {
        const vm = this;
        const items = this.get().items.map(item => {
            if (item._id === id) {
                item.sessions.push({
                    start: Date.now(),
                    end: Date.now()
                })
            }

            return item;
        });

        /** @todo make this efficient */
        setInterval(() => {
            const items = this.get().items.map(item => {
                if (item._id === id) {
                    item.sessions[item.sessions.length - 1].end = Date.now();
                }

                return item;
            });

            this.set({ items });
        }, 1000);

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
