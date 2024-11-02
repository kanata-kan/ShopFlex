const express = require('express');

const {
  getCategories,
  createCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadImageCaterory,
  reSizeImage,
} = require('../services/categoryService');
const {
  creatCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require('../utils/validators/categoryValidators');
const subCategoryRoute = require('./subCategoryRoute');
const authService = require('../services/authService');

const router = express.Router();

router.use('/:categoryId/subCategories', subCategoryRoute);

router
  .route('/')
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadImageCaterory,
    reSizeImage,
    creatCategoryValidator,
    createCategories,
  );

router
  .route('/:id')
  .get(getCategoryValidator, getCategoryById)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadImageCaterory,
    reSizeImage,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteCategoryValidator,
    deleteCategory,
  );

module.exports = router;
