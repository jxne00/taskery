/**
 * Convert milliseconds to dd MMM yyyy format
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
 * Convert seconds to hours, minutes, and seconds
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

/**
 * Calculate the time since a given date
 * @param {number} date date in milliseconds
 */
const timeSinceDate = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const { hours, minutes } = secondsToHMS(seconds);

    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${parseInt(days, 10)}d ago`;
    } else if (hours > 0) {
        return `${parseInt(hours, 10)}h ago`;
    } else if (minutes > 0) {
        return `${parseInt(minutes, 10)}min${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${parseInt(seconds, 10)}sec${seconds > 1 ? 's' : ''} ago`;
    }
};

export { toDateDisplay, secondsToHMS, timeSinceDate };
