// The purpose of auth controller is to check for the authentication before signing up for the user or before creating user
// It basically check the details provided by the user is valid and correct to be stored into the database
const User = require('../models/userModel');
const catchasync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const signup = catchasync(async (req, res, next) => {
  // This piece of code is wrong as it store all the data and anyone can access the data by registerign themselves as admin
  // const newuser = await User.create(req.body);
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // JWT Auth token created which is using id of the user and later storing that token into the database
  const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newuser,
    },
  });
});
module.exports = { signup };
