const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID format. ID must be a valid MongoDB ID.'),
  validatorMiddleware,
];

exports.creatCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3 })
    .withMessage('Category name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Category name must be at most 32 characters')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID format. ID must be a valid MongoDB ID.'),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID format. ID must be a valid MongoDB ID.'),
  validatorMiddleware,
];
