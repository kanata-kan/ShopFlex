const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getsubCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID format. ID must be a valid MongoDB ID.'),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('SubCategory name is required')
    .isString()
    .withMessage('SubCategory name must be a string')
    .isLength({ min: 2 })
    .withMessage('SubCategory name must be at least 2 characters')
    .isLength({ max: 32 })
    .withMessage('SubCategory name must be at most 32 characters'),
  check('category').isMongoId().withMessage('Invalid category ID format'),
  validatorMiddleware,
];
exports.updatesubCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID format. ID must be a valid MongoDB ID.'),
  validatorMiddleware,
];

exports.deletesubCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID format. ID must be a valid MongoDB ID.'),
  validatorMiddleware,
];
