const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const BrandModel = require('../models/brandModel');
const Factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

exports.uploadImageBrand = uploadSingleImage('image');

// desc: Resize the image before uploading
exports.reSizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .toFile(`uploads/brands/${fileName}`);
  req.body.image = fileName;
  next();
});

// desc: Get list of brands with pagination
// route: GET api/v1/brands
// access: Public
exports.getBrands = Factory.getAll(BrandModel);

// desc: Get specific brand by ID
// route: GET api/v1/brands/:id
// access: Private
exports.getBrandById = Factory.getOne(BrandModel);

// desc: Create a new brand
// route: POST api/v1/brands
// access: Private
exports.createBrand = Factory.createOne(BrandModel);

// desc: Update a specific brand
// route: PUT api/v1/brands/:id
// access: Private
exports.updateBrand = Factory.updateOne(BrandModel);

// desc: Delete a specific brand
// route: DELETE api/v1/brands/:id
// access: Private
exports.deleteBrand = Factory.deleteOne(BrandModel);
