const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const { createToken } = require('../utils/createToken');

/**
 * @desc    Sign up new user and generate JWT token
 * @route   POST /api/v1/auth/signUp
 * @access  Public
 */
exports.signUp = asyncHandler(async (req, res, next) => {
  // Create a new user with provided details
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // Generate a JWT token for the newly created user
  const token = createToken(user._id);

  // Send user data and token in the response
  res.status(201).json({ data: user, token });
});

/**
 * @desc    Log in existing user and return JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  // Find the user by email in the database
  const user = await User.findOne({ email: req.body.email });

  // Check if user exists and if the provided password matches the stored password
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Invalid email or password', 401)); // Unauthorized access
  }

  // Optional: Check if the user's account is active
  if (!user.active) {
    return next(
      new ApiError('Your account is deactivated. Contact support.', 403),
    ); // Forbidden access
  }

  // Generate a JWT token for the authenticated user
  const token = createToken(user._id);

  // Send user data and token in the response
  res.status(200).json({ data: user, token });
});

// Middleware to protect routes by ensuring that the user is authenticated
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Get token from the request header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError('You are not authorized to access this route', 401),
    );
  }

  // 2)  Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if the user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    );
  }
  // 4) Check if the user changed password after token was created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimesTamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );

    if (passwordChangedTimesTamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed password. Please login again.',
          401,
        ),
      );
    }
  }

  req.user = currentUser;
  next();
});

// 5) check is roles are allowed
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `User role ${req.user.role} is not allowed to access this route`,
          403,
        ),
      );
    }
    next();
  });

/**
 * @desc    Forgot password confirmation message for current user.
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Find the user by email in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`No user found with this email : ${req.body.email}`, 404),
    );
  }
  // send the reset code via email
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeDecoded = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  user.passwordResetCode = resetCodeDecoded;
  user.passwordResetCodeExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.passwordResetVerified = false;
  await user.save();

  // Send the email with the reset code

  const message = `You requested a password reset. Your reset token is: ${resetCode}. This token is valid for 10 minutes. If you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpiresAt = undefined;
    user.passwordResetVerified = false;

    await user.save();

    return next(
      new ApiError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

/**
 * @desc    Verify reset code for password reset.
 * @route   POST /api/v1/auth/verify-reset-password
 * @access  Public
 */
exports.verifyResetPassword = asyncHandler(async (req, res, next) => {
  const resetCodeDecoded = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');
  const user = await User.findOne({
    passwordResetCode: resetCodeDecoded,
    passwordResetCodeExpiresAt: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError('Invalid or expired reset code', 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: 'success',
    message: 'Reset code verified!',
  });
});

/**
 * @desc    Update password for current user.
 * @route   PUT /api/v1/auth/update-password
 * @access  Private
 */

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`No user found with this email : ${req.body.email}`, 404),
    );
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 403));
  }
  // Hash the new password
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpiresAt = undefined;
  user.passwordResetVerified = false;

  await user.save();
  // Generate a new JWT token for the updated user
  const token = createToken(user._id);
  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully!',
    token,
  });
});
