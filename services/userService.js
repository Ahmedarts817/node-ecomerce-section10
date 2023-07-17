const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const User = require('../models/userModel');

// Upload single image
exports.uploadUserImage = uploadSingleImage('profileImg');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/users/${filename}`);

  // Save image into our db 
   req.body.profileImg = filename;

  next();
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  private
exports.getUsers = factory.getAll(User);

// @desc    Get specific brand by id
// @route   GET /api/v1/users/:id
// @access  private
exports.getUser = factory.getOne(User);

// @desc    Create brand
// @route   POST  /api/v1/users
// @access  private
exports.createUser = factory.createOne(User);

// @desc    Update specific brand
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = factory.updateOne(User);

// @desc    Delete specific brand
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);
