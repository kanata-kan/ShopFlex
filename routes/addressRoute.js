const express = require('express');
const authService = require('../services/authService');
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require('../services/addressService');

const router = express.Router();

router
  .route('/')
  .post(authService.protect, authService.allowedTo('user'), addAddress)
  .get(
    authService.protect,
    authService.allowedTo('user'),
    getLoggedUserAddresses,
  );

router
  .route('/:addressId')
  .delete(authService.protect, authService.allowedTo('user'), removeAddress);

module.exports = router;

module.exports = router;
