const express = require('express');

const {
  addProductToCart,
  getLoggedUserCart,
  removeCartItems,
  deleteCart,
  updateCartItemQuantity,
  applyCoupon,
} = require('../services/cartService');

const authService = require('../services/authService');

const router = express.Router();

router
  .route('/applyCoupon')
  .post(authService.protect, authService.allowedTo('user'), applyCoupon);

router
  .route('/')
  .get(authService.protect, authService.allowedTo('user'), getLoggedUserCart)
  .delete(authService.protect, authService.allowedTo('user'), deleteCart)

  .post(authService.protect, authService.allowedTo('user'), addProductToCart);
router
  .route('/:itemId')
  .put(
    authService.protect,
    authService.allowedTo('user'),
    updateCartItemQuantity,
  )
  .delete(authService.protect, authService.allowedTo('user'), removeCartItems);

module.exports = router;
