const slugify = require('slugify');
const { param, check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const CategoryModel = require('../../models/categoryModel');
const SubCategoryModel = require('../../models/subCategoryModel');

exports.getProductValidator = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  validatorMiddleware,
];

exports.createProductValidator = [
  check('title')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .notEmpty()
    .withMessage('Product required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 20 })
    .withMessage('Too short product description'),
  check('quantity')
    .isInt({ min: 0 })
    .withMessage('Product quantity must be a positive integer'),
  check('price')
    .isFloat({ min: 0 })
    .withMessage('Product price must be a positive number'),
  check('priceAfterDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Product price after discount must be a positive number')
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error(
          'Price after discount must be less than the original price',
        );
      }
      return true;
    }),
  check('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array of strings'),
  check('imageCover').notEmpty().withMessage('Product image cover is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of strings'),
  check('category')
    .isMongoId()
    .withMessage('Invalid category ID')
    .custom(async categoryId => {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        throw new Error('Category does not exist');
      }
      return true;
    }),
  check('subCategory') // تعديل هنا ليتطابق مع البيانات
    .isMongoId()
    .withMessage('Invalid subcategory ID')
    .custom(async (subCategoryId, { req }) => {
      const subCategory = await SubCategoryModel.findById(subCategoryId);
      if (!subCategory) {
        throw new Error('Subcategory does not exist');
      }

      if (subCategory.category.toString() !== req.body.category) {
        throw new Error('Subcategory does not belong to the selected category');
      }

      return true;
    }),

  check('brand').optional().isMongoId().withMessage('Invalid brand ID'),
  check('ratingsAverage')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings average must be between 1 and 5'),
  check('ratingsQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Ratings quantity must be a positive integer'),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long')
    .custom((val, { req }) => {
      if (val) {
        req.body.slug = slugify(val); // تأكد من أن val موجود
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  validatorMiddleware,
];
