//const asyncHandler = require('express-async-handler');
const ReviewModel = require('../models/reviewModel');
const Factory = require('./handlersFactory');

// Middleware to set productId in body for reviews
// nested route
exports.setProductIdBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};
// desc: Get list of review with pagination
// route: GET api/v1/reviews
// access: Public
exports.getReviews = Factory.getAll(ReviewModel);

// desc: Get specific review by ID
// route: GET api/v1/reviews/:id
// access: Private
exports.getReviewById = Factory.getOne(ReviewModel);

// Nested route (Create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// desc: Create a new review
// route: POST api/v1/reviews
// access: Private protect / USER
exports.createReview = Factory.createOne(ReviewModel);

// desc: Update a specific review
// route: PUT api/v1/reviews/:id
// access: Private protect / USER
exports.updateReview = Factory.updateOne(ReviewModel);

// desc: Delete a specific review
// route: DELETE api/v1/reviews/:id
// access: Private protect / USER / ADMIN / MANAGER
exports.deleteReview = Factory.deleteOne(ReviewModel);
