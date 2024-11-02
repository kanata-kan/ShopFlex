const express = require('express');
const authService = require('../services/authService');
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlist,
} = require('../services/wishListService');

const router = express.Router();

router
  .route('/')
  .post(
    authService.protect,
    authService.allowedTo('user'),
    addProductToWishlist,
  )
  .get(authService.protect, authService.allowedTo('user'), getWishlist);

router
  .route('/:productId')
  .delete(
    authService.protect,
    authService.allowedTo('user'),
    removeProductFromWishlist,
  );

module.exports = router;

module.exports = router;
