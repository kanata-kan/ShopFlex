const express = require('express');
const {
  signUp,
  login,
  forgotPassword,
  verifyResetPassword,
  updatePassword,
} = require('../services/authService');
const {
  signUpValidator,
  loginValidator,
} = require('../utils/validators/authValidators');

const router = express.Router();

router.route('/signup').post(signUpValidator, signUp);
router.route('/login').post(loginValidator, login);
router.route('/forgot-password').post(forgotPassword);
router.route('/verify-reset-password').post(verifyResetPassword);
router.route('/update-password').put(updatePassword);

module.exports = router;
