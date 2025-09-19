// utils/errorHandler.js

/**
 * Centralized error handling middleware for Express
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
module.exports = (err, req, res, next) => {
  console.error(err.stack); // Log full stack trace for debugging

  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message
  });
};
