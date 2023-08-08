// The purpose of auth controller is to check for the authentication before signing up for the user or before creating user
// It basically check the details provided by the user is valid and correct to be stored into the database
const User = require('../models/userModel');
const catchasync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const apperror = require('../utils/appError');
const { promisify } = require('util');
// the below signup route implementation is for when new user signup
const signup = catchasync(async (req, res, next) => {
  // This piece of code is wrong as it store all the data and anyone can access the data by registerign themselves as admin
  // const newuser = await User.create(req.body);
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // JWT Auth token created which is using id of the user and later storing that token into the database. The below created jwt token does not store id into its token
  const payload = { id: newuser._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
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

// the below login route implemtation is for when new user login
const login = catchasync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // if user does not enter password or email then below code execute
  if (!email || !password) {
    return next(new apperror('Please provide email and password', 400));
  }
  // find the details of the user whose email id is given
  const user = await User.findOne({ email }).select('+password');
  // check for the correct password
  const correct = await user.correctPassword(password, user.password);
  // if anything is incorrect below code execute
  if (!user || !correct) {
    return next(new apperror('Incorrect email or password', 401));
  }
  // otherwise if all is right it will generate a webtoken and then output success and below code execute
  const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: 'success',
    token,
  });
});

// This middleware is used which allow user to first login then see all the tours available
const protect = catchasync(async (req, res, next) => {
  // get token and check if its there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new apperror('Your are not logged in! Please login to get access', 401)
    );
  }
  // validate the token or verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user exists
  const freshuser = await User.findById(decoded.id);
  if (!freshuser) {
    return next(
      new apperror('The user belonging to token does not no longer exist', 401)
    );
  }
  // check if user change password after token was issued
  if (freshuser.changedPasswordAfter(decoded.iat)) {
    return next(
      new apperror('User recently chnaged password. Please login again', 401)
    );
  }
  // grant access to protected route
  req.user = freshuser;
  next();
});
module.exports = { signup, login, protect };
