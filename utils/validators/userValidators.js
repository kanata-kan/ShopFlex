const slugify = require('slugify');
const bcrypt = require('bcrypt');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(val =>
      User.findOne({ email: val }).then(user => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      }),
    ),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password Confirmation is required'),
  check('phone').optional(),
  //.isMobilePhone(['ar-EG', 'ar-SA'])
  //.withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  check('profileImg').optional(),
  check('role').optional(),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid user id'),
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('password')
    .notEmpty()
    .withMessage('You must enter your new password')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error('There is no user for this id');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password,
      );
      if (!isCorrectPassword) {
        throw new Error('Current password is incorrect');
      }
      return true;
    }),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must confirm your new password')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.changeMyPasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('password')
    .notEmpty()
    .withMessage('You must enter your new password')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error('There is no user for this id');
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password,
      );

      if (!isCorrectPassword) {
        throw new Error('Current password is incorrect');
      }
      return true;
    }),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must confirm your new password')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(val =>
      User.findOne({ email: val }).then(user => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      }),
    ),
  check('phone').optional(),
  //.isMobilePhone(['ar-EG', 'ar-SA'])
  //.withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImg').optional(),
  check('role').optional(),
  validatorMiddleware,
];

exports.updateUserOnValidator = [
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(val =>
      User.findOne({ email: val }).then(user => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      }),
    ),
  check('phone').optional(),
  //.isMobilePhone(['ar-EG', 'ar-SA'])
  //.withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];
