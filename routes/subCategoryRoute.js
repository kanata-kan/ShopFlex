const express = require('express');
const {
  createSubCategory,
  getSubCategory,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
  setCategoryIdBody,
} = require('../services/subCategoryService');
const {
  createSubCategoryValidator,
  getsubCategoryValidator,
  updatesubCategoryValidator,
  deletesubCategoryValidator,
} = require('../utils/validators/subCategoryValidators');
const authService = require('../services/authService');

const router = express.Router({ mergeParams: true });

// Creat sub categories

router
  .route('/')
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    setCategoryIdBody,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(getSubCategory);

router
  .route('/:id')
  .get(getsubCategoryValidator, getSubCategoryById)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updatesubCategoryValidator,
    updateSubCategoryById,
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deletesubCategoryValidator,
    deleteSubCategoryById,
  );
module.exports = router;
