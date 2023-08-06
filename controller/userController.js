const catchasync = require('../utils/catchAsync');
const User = require('../models/userModel');
// getallusers route functionality implemented
const getallusers = catchasync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

const creatuser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not yet definded' });
};

const getuser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not yet definded' });
};

const updateuser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not yet definded' });
};

const deleteuser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not yet definded' });
};
module.exports = { getallusers, creatuser, getuser, updateuser, deleteuser };
