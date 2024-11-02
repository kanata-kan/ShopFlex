const { check, body, param } = require('express-validator');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createReviewValidator = [
  check('title')
    .optional()
    .isLength({ min: 5, max: 255 })
    .withMessage('Review title must be between 5 and 255 characters'),

  check('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be a number between 1 and 5'),

  check('product')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format'),

  check('user')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  check('user').custom(async (userId, { req }) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found with that ID');
    }
    return true;
  }),
  check().custom(async (_, { req }) => {
    const existingReview = await Review.findOne({
      product: req.body.product,
      user: req.user._id,
    });

    if (existingReview) {
      console.log('Review already exists. Throwing error...');
      throw new Error('You have already reviewed this product');
    }

    return true;
  }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  param('id').isMongoId().withMessage('Invalid review ID format'),

  check('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be a number between 1 and 5'),

  check('user').custom(async (user, { req }) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw new Error('No review found with that ID');
    }

    // Check if review.user exists before accessing _id
    if (!review.user) {
      throw new Error('No user associated with this review');
    }

    if (review.user._id.toString() !== req.user._id.toString()) {
      return Promise.reject(
        new Error('You are not allowed to perform this action'),
      );
    }
    return true;
  }),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  param('id').isMongoId().withMessage('Invalid review ID format'),

  body('user').custom(async (userId, { req }) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw new Error('No review found with that ID');
    }

    if (
      review.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'manager'
    ) {
      throw new Error('You are not allowed to delete this review');
    }

    return true;
  }),
  validatorMiddleware,
];
