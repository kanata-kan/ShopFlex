const express = require('express');

const {
  createCashOrder,
  filterOrderForLoggedUsers,
  getAllOrders,
  getOnerder,
  updateOrderPaid,
  updateOrderDelivered,
  checkoutSession,
} = require('../services/orderService');

const authService = require('../services/authService');

const router = express.Router();
router
  .route('/:cartId')
  .post(authService.protect, authService.allowedTo('user'), createCashOrder);
router
  .route('/')
  .get(
    authService.protect,
    authService.allowedTo('user', 'admin', 'manager'),
    filterOrderForLoggedUsers,
    getAllOrders,
  );
router
  .route('/:id/paid')
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updateOrderPaid,
  );

router
  .route('/:id/delivered')
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updateOrderDelivered,
  );

router.route('/:id').get(authService.protect, getOnerder);

router
  .route('/checkout-session/:cartId')
  .get(authService.protect, authService.allowedTo('user'), checkoutSession);

module.exports = router;
