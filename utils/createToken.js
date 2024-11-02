const jwt = require('jsonwebtoken');

// Function to create JWT token with expiration time
exports.createToken = payload =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIR_TIME,
  });
