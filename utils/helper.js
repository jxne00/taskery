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

export { toDateDisplay };
