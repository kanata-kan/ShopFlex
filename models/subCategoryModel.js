const mongoose = require('mongoose');

// sub category schema

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'subCategory must be unique'],
      minLength: [2, 'to short sub category name'],
      maxLength: [32, 'to long sub category name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true },
);

// sub category model

module.exports = mongoose.model('SubCategory', subCategorySchema);
