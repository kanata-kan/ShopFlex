/* eslint-disable node/no-unsupported-features/es-syntax */
class ApiFeatures {
  constructor(queryObj, queryString) {
    this.queryObj = queryObj;
    this.queryString = queryString;
  }

  // فلترة البيانات
  filter() {
    const filterQueryObj = { ...this.queryString };
    const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludesFields.forEach(param => delete filterQueryObj[param]);

    let queryStr = JSON.stringify(filterQueryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const filteredQuery = JSON.parse(queryStr);

    if (Object.keys(filteredQuery).length > 0) {
      this.queryObj = this.queryObj.find(filteredQuery);
    }
    return this;
  }

  // ترتيب البيانات
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.queryObj = this.queryObj.sort(sortBy);
    } else {
      this.queryObj = this.queryObj.sort('-createdAt');
    }
    return this;
  }

  // البحث في البيانات
  search(model) {
    if (this.queryString.keyword) {
      let searchQuery;

      if (model === 'products') {
        searchQuery = {
          $or: [
            { title: { $regex: this.queryString.keyword, $options: 'i' } },
            {
              description: { $regex: this.queryString.keyword, $options: 'i' },
            },
          ],
        };
      } else {
        searchQuery = {
          name: { $regex: this.queryString.keyword, $options: 'i' },
        };
      }

      this.queryObj = this.queryObj.find(searchQuery);
    }
    return this;
  }

  // تحديد الحقول (fields)
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.queryObj = this.queryObj.select(fields);
    } else {
      this.queryObj = this.queryObj.select('-__v');
    }
    return this;
  }

  // تقسيم النتائج (Pagination)
  pagination() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.queryObj = this.queryObj.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
