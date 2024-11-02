const mongoose = require('mongoose');

// Coupon Schema
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name coupon is required'],
      unique: [true, 'name coupon is unique'],
      trim: true,
    },
    expire: {
      type: Date,
      required: [true, 'expiry date is required'],
    },
    discount: {
      type: Number,
      required: [true, 'discount is required'],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Coupon', couponSchema);
