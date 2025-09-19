// middleware/authMiddleware.js

exports.authenticate = (req, res, next) => {
  // Dummy authentication for now
  // You can implement JWT later
  next();
};
