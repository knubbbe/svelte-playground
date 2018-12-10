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

export {
    keyEvent,
    uniqueId
};
