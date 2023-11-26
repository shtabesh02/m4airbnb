// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    if (errors['endDate'] === 'End date conflicts with an existing booking' ||
      errors['startDate'] === 'Start Date conflicts with an existing booking') {
      return _res.status(403).json({
        message: 'Sorry, this spot is already booked for the specified dates',
        errors: errors
      });
    } else {
      return _res.status(400).json({
        message: 'Bad Request',
        errors: errors
      });
    }


  }
  next();
};

module.exports = {
  handleValidationErrors
};

/**
  if (ve['endDate'] === 'endDate cannot be on or before startDate') { // this msg is set in booking model, validation
            return res.status(400).json({
              message: "Bad Request",
              errors: ve
            });
          } else {
            return res.status(403).json({
              message: "Sorry, this spot is already booked for the specified dates",
              errors: ve
            });
          }
 */

// validation before adding if

/**
const handleValidationErrors = (req, _res, next) => {
const validationErrors = validationResult(req);

if (!validationErrors.isEmpty()) { 
  const errors = {};
  validationErrors
    .array()
    .forEach(error => errors[error.path] = error.msg);

  return _res.status(400).json({
    message: 'Bad Request',
    errors: errors
  });
}
next();
};

module.exports = {
handleValidationErrors
};
 */