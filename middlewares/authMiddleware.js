const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.checkRoleMiddleware = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userRoles = req.user.roles; // Assuming roles are stored as an array of strings
  const hasRequiredRole = roles.some(role => userRoles.includes(role));

  if (!hasRequiredRole) {
    return res.status(403).json({ error: 'Forbidden: You do not have the required role' });
  }

  next();
};