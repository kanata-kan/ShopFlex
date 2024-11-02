const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');
const Factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const { createToken } = require('../utils/createToken');
const ApiError = require('../utils/ApiError');

exports.uploadImageUser = uploadSingleImage('profileImg');

// desc: Resize the image before uploading
exports.reSizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .toFile(`uploads/users/${fileName}`);
    req.body.profileImg = fileName;
  }

  next();
});

// desc: Get list of user with pagination
// route: GET api/v1/users
// access: Private
exports.getUsers = Factory.getAll(UserModel);

// desc: Get specific user by ID
// route: GET api/v1/users/:id
// access: Private
exports.getUserById = Factory.getOne(UserModel);

// desc: Create a new user
// route: POST api/v1/users
// access: Private
exports.createUser = Factory.createOne(UserModel);

// desc: Update a specific user
// route: PUT api/v1/users/:id
// access: Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      profileImg: req.body.profileImg,
      phone: req.body.phone,
      role: req.body.role,
      isActive: req.body.isActive,
      updatedAt: new Date(),
    },
    {
      new: true,
    },
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});

// desc: Update a user password
// route: PUT api/v1/users/change_password/:id
// access: Private
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.password) {
    return next(new ApiError('Password is required', 400));
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userPassword = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: hashedPassword,
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  if (!userPassword) {
    return next(
      new ApiError(`No user found for this id ${req.params.id}`, 404),
    );
  }

  res.status(200).json({ data: userPassword });
});

// desc: Delete a specific user
// route: DELETE api/v1/users/:id
// access: Private
exports.deleteUser = Factory.deleteOne(UserModel);

// desc: Get specific user by ID
// route: GET api/v1/users/getMe
// access: Private protected

exports.getUserMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// desc: Update my password
// route: PUT api/v1/users/change-my-password
// access: Private protected
exports.changeMyPassword = asyncHandler(async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: hashedPassword,
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  if (!user) {
    return next(new ApiError(`No user found for this id ${req.user._id}`, 404));
  }
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

// desc: Update my data for this user
// route: PUT api/v1/users/update-my-data
// access: Private protected
exports.updateMe = asyncHandler(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new ApiError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
    },
    {
      new: true,
    },
  );
  if (!updatedUser) {
    return next(new ApiError(`No user found for this id ${req.user._id}`, 404));
  }
  res.status(200).json({ data: updatedUser });
});

// desc: Delete my data for this user
// route: DELETE api/v1/users/delete-my-data
// access: Private protected

exports.deleteMe = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  if (!user) {
    return next(new ApiError(`No user found for this id ${req.user._id}`, 404));
  }
  res.status(204).json({ message: 'User deleted successfully' });
});
