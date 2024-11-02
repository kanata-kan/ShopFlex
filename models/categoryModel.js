const mongoose = require('mongoose');

// Categories Schema
const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'categories is required'],
      unique: [true, 'categories is unique'],
      trim: true,
      minlength: [3, 'categories must be at least 3 characters'],
      maxlength: [32, 'categories must be at most 32 characters'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true },
);
const setUrlImage = doc => {
  if (doc.image) {
    const url = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = url;
  }
};

categoriesSchema.post('init', doc => {
  setUrlImage(doc);
});

categoriesSchema.post('save', doc => {
  setUrlImage(doc);
});

// Category models
const CategoryModel = mongoose.model('Category', categoriesSchema);

module.exports = CategoryModel;
