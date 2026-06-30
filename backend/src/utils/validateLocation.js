const validateLocation = (location) => {
  if (!location || typeof location !== "string") {
    return {
      valid: false,
      error: "Location is required and must be a string."
    };
  }

  const value = location.trim();

  if (value.length === 0) {
    return {
      valid: false,
      error: "Location cannot be empty."
    };
  }

  if (value.length < 2) {
    return {
      valid: false,
      error: "Location is too short."
    };
  }

  if (value.length > 100) {
    return {
      valid: false,
      error: "Location is too long."
    };
  }

  // Allow letters, numbers, spaces, commas, periods, and hyphens
  const validPattern = /^[a-zA-Z0-9\s,.-]+$/;

  if (!validPattern.test(value)) {
    return {
      valid: false,
      error: "Location contains invalid characters."
    };
  }

  return {
    valid: true,
    location: value
  };
};

module.exports = validateLocation;