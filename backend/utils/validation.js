// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const firstErr = validationErrors.array()[0];
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    if (errors['conflict_message'] || errors['startDate'] === 'Start Date on Existing Start Date' || 
    errors['endDate'] === 'End Date On Existing End Date' ||
    errors['startDate'] === 'Start Date on Existing Start Date' ||
    errors['startDate'] === 'Start Date On Existing End Date' ||
    errors['endDate'] === 'End Date On Existing Start Date'||
    errors['startDate'] === 'startDate conflicts with an existing booking'||
    errors['endDate'] === 'endDate conflicts with an existing booking') {
      return _res.status(403).json({
        message: 'Sorry, this spot is already booked for the specified dates',
        errors: errors
      });
    }else if(firstErr.path === 'bookingId'){
      return _res.status(404).json({
          "message": firstErr.msg
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