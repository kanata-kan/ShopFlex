const express = require('express');

const {
  getBrands,
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
  reSizeImage,
  uploadImageBrand,
} = require('../services/brandService');
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require('../utils/validators/brandValidators');
const subCategoryRoute = require('./subCategoryRoute');
const authService = require('../services/authService');

const router = express.Router();

router.use('/:brandId/subCategories', subCategoryRoute);

router
  .route('/')
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadImageBrand,
    reSizeImage,
    createBrandValidator,
    createBrand,
  );

router
  .route('/:id')
  .get(getBrandValidator, getBrandById)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadImageBrand,
    reSizeImage,
    updateBrandValidator,
    updateBrand,
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteBrandValidator,
    deleteBrand,
  );

module.exports = router;
