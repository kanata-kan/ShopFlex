// upload.js
const multer = require('multer');
const ApiError = require('../utils/ApiError');

const createMulterConfig = fields => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('Only image files are allowed!', 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  if (fields) {
    return upload.fields(fields);
  }

  return upload;
};

exports.uploadSingleImage = fileName => {
  const upload = createMulterConfig();
  return upload.single(fileName);
};

exports.uploadMultipleImages = fields => {
  const upload = createMulterConfig(fields);
  return upload;
};
