const mongoose = require('mongoose');

// Brands Schema
const brandsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'brands is required'],
      unique: [true, 'brands is unique'],
      trim: true,
      minlength: [2, 'brands must be at least 2 characters'],
      maxlength: [32, 'brands must be at most 32 characters'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    image: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true },
);

const setUrlImage = doc => {
  const url = `${process.env.BASE_URL}brands/${doc.image}`;
  doc.image = url;
};
brandsSchema.post('init', doc => {
  setUrlImage(doc);
});
brandsSchema.post('save', doc => {
  setUrlImage(doc);
});

// Brand models
const BrandModel = mongoose.model('Brand', brandsSchema);

module.exports = BrandModel;
