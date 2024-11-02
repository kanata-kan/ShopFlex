const express = require('express');

const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  setProductIdAndUserIdToBody,
} = require('../services/reviewService');

const authService = require('../services/authService');
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require('../utils/validators/reviewValidator');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getReviews)
  .post(
    authService.protect,
    authService.allowedTo('user'),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  );

router
  .route('/:id')
  .get(getReviewById)
  .put(
    authService.protect,
    authService.allowedTo('user'),
    updateReviewValidator,
    updateReview,
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin', 'manager', 'user'),
    deleteReviewValidator,
    deleteReview,
  );

module.exports = router;
