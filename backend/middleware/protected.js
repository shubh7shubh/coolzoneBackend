// middleware/protected.js
const { isAuthenticatedUser } = require('./auth'); // Import your existing authentication middleware
const ErrorHander = require("../utils/errorhander");

exports.protected = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    isAuthenticatedUser(req, res, async () => {
      // If roles are provided, check if user has the necessary role
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return next(
          new ErrorHander(
            `Role: ${req.user.role} is not allowed to access this resource`,
            403
          )
        );
      }
      
      next();
    });
  };
};
