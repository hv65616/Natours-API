// The purpose of auth controller is to check for the authentication before signing up for the user or before creating user
// It basically check the details provided by the user is valid and correct to be stored into the database
const User = require('../models/userModel');
const catchasync = require('../utils/catchAsync');
const signup = catchasync(async (req, res, next) => {
  const newuser = await User.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      user: newuser,
    },
  });
});
module.exports = { signup };
