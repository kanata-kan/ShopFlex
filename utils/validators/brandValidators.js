const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getBrandValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID format. ID must be a valid MongoDB ID.'),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 2 })
    .withMessage('Brand name must be at least 2 characters')
    .isLength({ max: 32 })
    .withMessage('Brand name must be at most 32 characters')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID format. ID must be a valid MongoDB ID.'),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID format. ID must be a valid MongoDB ID.'),
  validatorMiddleware,
];
