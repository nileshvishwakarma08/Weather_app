module.exports = {
  validateLocation: (location) => {
    if (!location || typeof location !== 'string') {
      return { valid: false, message: 'Location is required' };
    }
    if (location.trim().length < 2) {
      return { valid: false, message: 'Location must be at least 2 characters long' };
    }
    return { valid: true };
  }
};
