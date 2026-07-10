const validateMobile = (data, isUpdate = false) => {
  const errors = [];
  const requiredFields = [
    'brand',
    'model',
    'ram',
    'storage',
    'color',
    'batteryHealth',
    'bodyCondition',
    'cameraCondition',
    'imei',
    'warranty',
    'price'
  ];

  if (!isUpdate) {
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push(`${field} is required.`);
      }
    }
  }

  // Price validation
  if (data.price !== undefined && data.price !== null) {
    const numPrice = Number(data.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      errors.push('Price must be a positive number.');
    }
  }

  // Battery health validation
  if (data.batteryHealth !== undefined && data.batteryHealth !== null) {
    const bh = Number(data.batteryHealth);
    if (isNaN(bh) || bh < 0 || bh > 100) {
      errors.push('Battery health must be between 0 and 100.');
    }
  }

  // Status validation
  const validStatuses = ['Available', 'Sold', 'Reserved', 'Coming Soon'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateMobile,
};
