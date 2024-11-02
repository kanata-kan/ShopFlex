const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const CategoryModel = require('../models/categoryModel');
const Factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

exports.uploadImageCaterory = uploadSingleImage('image');

// desc: Resize the image before uploading
exports.reSizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `categoriy-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .toFile(`uploads/categories/${fileName}`);
    req.body.image = fileName;
  }

  next();
});

// desc: Get list of categories with pagination
// route: GET api/v1/categories
// access: Public
exports.getCategories = Factory.getAll(CategoryModel);

// desc: Get specific category by ID
// route: GET api/v1/categories/:id
// access: Private
exports.getCategoryById = Factory.getOne(CategoryModel);

// desc: Create a new category
// route: POST api/v1/categories
// access: Private
exports.createCategories = Factory.createOne(CategoryModel);

// desc: Update a specific category
// route: PUT api/v1/categories/:id
// access: Private
exports.updateCategory = Factory.updateOne(CategoryModel);

// desc: Delete a specific category
// route: DELETE api/v1/categories/:id
// access: Private
exports.deleteCategory = Factory.deleteOne(CategoryModel);
