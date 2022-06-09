const { validationResult } = require("express-validator");

const fieldValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      message: errors.array(),
    });
  }
  next();
};

module.exports = fieldValidation;
