const express = require('express');

const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  reSizeImage,
  uploadImageUser,
  updateUserPassword,
  getUserMe,
  changeMyPassword,
  updateMe,
  deleteMe,
} = require('../services/userService');

const {
  createUserValidator,
  changeUserPasswordValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeMyPasswordValidator,
  updateUserOnValidator,
} = require('../utils/validators/userValidators');
const authService = require('../services/authService');

const router = express.Router();

// User routes

router.route('/getMe').get(authService.protect, getUserMe, getUserById);

router
  .route('/change-my-password')
  .put(authService.protect, changeMyPasswordValidator, changeMyPassword);
router
  .route('/update-my-data')
  .put(authService.protect, updateUserOnValidator, updateMe);
router.route('/delete-my-data').delete(authService.protect, deleteMe);

// Admin routes

router
  .route('/')
  .get(authService.protect, authService.allowedTo('admin', 'manager'), getUsers)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadImageUser,
    reSizeImage,
    createUserValidator,
    createUser,
  );

router.put(
  '/change_password/:id',
  authService.protect,
  authService.allowedTo('admin'),
  changeUserPasswordValidator,
  updateUserPassword,
);

router
  .route('/:id')
  .get(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    getUserValidator,
    getUserById,
  )
  .put(
    authService.protect,
    authService.allowedTo('admin'),
    uploadImageUser,
    reSizeImage,
    updateUserValidator,
    updateUser,
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteUserValidator,
    deleteUser,
  );

module.exports = router;
