const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');

// desc: Add a product to the wishlist
// route: POST api/v1/wishlist
// access: Protected / user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishList: req.body.productId } }, // Using $addToSet to avoid duplicates
    { new: true },
  );
  res.status(200).json({
    status: 'success',
    message: 'Product added to wishlist successfully!',
    data: user.wishList,
  });
});

// desc: Remove a product from the wishlist
// route: DELETE api/v1/wishlist/:productId
// access: Protected / user
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishList: req.params.productId } }, // Using $pull to remove the product
    { new: true },
  );
  res.status(200).json({
    status: 'success',
    message: 'Product removed from wishlist successfully!',
    data: user.wishList,
  });
});

// desc: Get all products in the wishlist
// route: GET api/v1/wishlist
// access: Protected / user
exports.getWishlist = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate('wishList');
  res.status(200).json({
    status: 'success',
    result: user.wishList.length,
    data: user.wishList,
  });
});
