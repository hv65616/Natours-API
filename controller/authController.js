// The purpose of auth controller is to check for the authentication before signing up for the user or before creating user
// It basically check the details provided by the user is valid and correct to be stored into the database
const User = require('../models/userModel');
const catchasync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const apperror = require('../utils/appError');
const { promisify } = require('util');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
// the below signup route implementation is for when new user signup
const signup = catchasync(async (req, res, next) => {
  // This piece of code is wrong as it store all the data and anyone can access the data by registerign themselves as admin
  // const newuser = await User.create(req.body);
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    //passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    photo: req.body.photo,
    active: req.body.active,
  });
  // JWT Auth token created which is using id of the user and later storing that token into the database. The below created jwt token does not store id into its token
  const payload = { id: newuser._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // creating cookie and setting it as jwt
  const cookieoptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieoptions.secure = true;
  res.cookie('jwt', token, cookieoptions);
  newuser.password = undefined;
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
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // creating cookie and setting it as jwt
  const cookieoptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieoptions.secure = true;
  res.cookie('jwt', token, cookieoptions);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});

// The logout route implementation which make the loggedin jwt into a false jwt and set it into the browser
const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expiresIn: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'Loggedout Success',
  });
};

// This middleware is used which allow user to first login then see all the tours available
const protect = catchasync(async (req, res, next) => {
  // get token and check if its there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = freshuser;
  next();
});

// This restrictto middleware is responsible to first the check the role of the user before deleting any tour
const restrictto = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new apperror('You do not have permission to perform the action', 403)
      );
    }
    next();
  };
};

// This is for forgot password endpoint which store the password reset token generated by instance method and then tranfer that token throuh email
const forgotpassword = catchasync(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new apperror('There is no user with the provided email address'),
      404
    );
  }
  // generate the random reset token
  const resettoken = user.createpasswordresettoken();
  await user.save({ validateBeforeSave: false });
  // sent it to the user email
  /*
  const reseturl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/resetpassword/${resettoken}`;
  const message = `Forgot your password? Submit a patch request with you rnew password and password confirm to: ${reseturl}. \nIf you didn't forget your password please ignore this email`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new apperror('There was an error sending the email. Try again later', 500)
    );
  }
  */
});

// This is for reset password endpoint
const resetpassword = catchasync(async (req, res, next) => {
  // Get user based on the token
  // console.log(req.params.token);
  const hasedtoken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  // console.log(hasedtoken);
  const user = await User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() },
  });
  // console.log(user);
  // If token has not expired and there is user set the new password
  if (!user) {
    return next(new apperror('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // Update changePasswordAt property for the user
  // Log the user in send JWT
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // creating cookie and setting it as jwt
  const cookieoptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieoptions.secure = true;
  res.cookie('jwt', token, cookieoptions);
  res.status(200).json({
    status: 'success',
    token,
  });
});

// This is a route for update password
const updatepassword = catchasync(async (req, res, next) => {
  // Get user from collection
  // console.log(5);
  console.log(req.body.id);
  const user = await User.findById(req.body.id).select('+password');
  console.log(user);
  // Check if posted password is correct
  // console.log(1);
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new apperror('Your current password is wrong', 401));
  }
  console.log(2);
  // If so then update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // Log user in send JWT
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // creating cookie and setting it as jwt
  const cookieoptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieoptions.secure = true;
  res.cookie('jwt', token, cookieoptions);
  res.status(200).json({
    status: 'success',
    token,
  });
});

// const updatepassword = catchasync(async (req, res, next) => {
//   const { email, oldpassword, newpassword, newpasswordconfirm } = req.body;
//   const user = await User.findOne({ email }).select('+password').exec();
//   console.log(user);
//   if (!user || (await user.correctPassword(oldpassword, user.password))) {
//     return next(new apperror('Incorrect Password'), 400);
//   }
//   user.password = newpassword;
//   user.passwordConfirm = newpasswordconfirm;
//   await user.save();
//   const payload = { id: user._id };
//   const token = jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
//   res.status(200).json({
//     status: 'success',
//     token,
//   });
// });

// Only for rendered pages, no errors
const isloggedin = async (req, res, next) => {
  console.log(req.cookies.jwt);
  // when login route hit try block run and when logout route hit catch block run
  try {
    if (req.cookies.jwt) {
      // verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      // check if user exists
      const freshuser = await User.findById(decoded.id);
      if (!freshuser) {
        return next();
      }
      // check if user change password after token was issued
      console.log('is logged in');
      if (freshuser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // There is a logged in user
      res.locals.user = freshuser;
      return next();
    }
  } catch (error) {
    return next();
  }
  next();
};
module.exports = {
  signup,
  login,
  protect,
  restrictto,
  forgotpassword,
  resetpassword,
  updatepassword,
  isloggedin,
  logout,
};
