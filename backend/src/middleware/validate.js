const AppError = require('../utils/AppError');

/**
 * Higher-order middleware to validate request data against a Zod schema.
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const message = error.errors.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    next(new AppError(message, 400));
  }
};

module.exports = validate;
