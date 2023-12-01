// helper functions

/**
 * convert milliseconds to dd MMM yyyy format
 *
 * @param {number} milliseconds date in milliseconds
 */
const toDateDisplay = (milliseconds) => {
    return new Date(milliseconds).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

/**
 * convert seconds to hours, minutes, and seconds
 *
 * @param {number} totalSeconds total seconds
 */
const secondsToHMS = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return { hours, minutes, seconds };
};

export { toDateDisplay, secondsToHMS };
