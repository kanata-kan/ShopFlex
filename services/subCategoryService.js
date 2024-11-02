/* eslint-disable no-undef */

const SubCategoryModel = require('../models/subCategoryModel');
const Factory = require('./handlersFactory');

// desc: Get a list of subcategories
// route: GET api/v1/categories/:categoryId/subCategories
// access: Public
exports.getSubCategory = Factory.getAll(SubCategoryModel);

// Middleware to set categoryId in body for subcategory creation
exports.setCategoryIdBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// desc: Create a new subcategory
// route: POST api/v1/categories/:categoryId/subCategories
// access: Private
exports.createSubCategory = Factory.createOne(SubCategoryModel);

// desc: Get a specific subcategory
// route: GET api/v1/subCategories/:id
// access: Public
exports.getSubCategoryById = Factory.getOne(SubCategoryModel);

// desc: Update a specific subcategory
// route: PUT api/v1/subCategories/:id
// access: Private
exports.updateSubCategoryById = Factory.updateOne(SubCategoryModel);

// desc: Delete a specific subcategory
// route: DELETE api/v1/subCategories/:id
// access: Private
exports.deleteSubCategoryById = Factory.deleteOne(SubCategoryModel);
