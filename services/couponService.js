const CouponModel = require('../models/couponModel');
const Factory = require('./handlersFactory');

// desc: Get list of coupon
// route: GET api/v1/coupons
// access: private // admin & manager
exports.getCoupons = Factory.getAll(CouponModel);

// desc: Get specific coupon by ID
// route: GET api/v1/coupons/:id
// access: private // admin & manager
exports.getCouponById = Factory.getOne(CouponModel);

// desc: Create a new coupon
// route: POST api/v1/coupons
// access: private // admin & manager
exports.createCoupon = Factory.createOne(CouponModel);

// desc: Update a specific coupon
// route: PUT api/v1/coupons/:id
// access: private // admin & manager
exports.updateCoupon = Factory.updateOne(CouponModel);

// desc: Delete a specific coupon
// route: DELETE api/v1/coupons/:id
// access: private // admin & manager
exports.deleteCoupon = Factory.deleteOne(CouponModel);
