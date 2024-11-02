/* eslint-disable node/no-unsupported-features/es-syntax */
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const ProductModel = require('../models/productModel');
const Factory = require('./handlersFactory');
const {
  uploadMultipleImages,
} = require('../middlewares/uploadImageMiddleware');

exports.multerFields = uploadMultipleImages([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

exports.uploadProductImages = exports.multerFields;

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const coverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${coverFilename}`);

    req.body.imageCover = coverFilename;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, index) => {
        const filename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(800, 800)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${filename}`);

        req.body.images.push(filename);
      }),
    );
  }

  next();
});

// desc: Get list of Products with pagination
// route: GET api/v1/products
// access: Public
exports.getProducts = Factory.getAll(ProductModel, 'products');

// desc: Get specific Product by Id
// route: GET api/v1/products/:id
// access: Private
exports.getProductById = Factory.getOne(ProductModel, 'reviews');

// desc: Create a new Product
// route: POST api/v1/products
// access: Private
exports.createProduct = Factory.createOne(ProductModel);
// desc: Update a specific Product
// route: PUT api/v1/products/:id
// access: Private
exports.updateProduct = Factory.updateOne(ProductModel);

// desc: Delete a specific Product
// route: DELETE api/v1/products/:id
// access: Private
exports.deleteProduct = Factory.deleteOne(ProductModel);
