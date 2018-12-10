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
    let delta = sessions.reduce((res, row) => {
        const diff = Math.abs(row.end - row.start) / 1000;

        console.log(
            res,
            diff,
            typeof res
        );
        if (typeof res === 'number') {
            return res + diff;
        }

        return diff;
    });

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = delta % 60;

    return {
        hours: (`${hours}`.length < 2) ? `0${hours}` : hours,
        minutes: (`${minutes}`.length < 2) ? `0${minutes}` : minutes,
        seconds: (`${seconds}`.length < 2) ? `0${seconds}` : seconds
    }
};

export {
    keyEvent,
    uniqueId,
    calculateSessionTime
};
