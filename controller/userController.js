const catchasync = require('../utils/catchAsync');
const User = require('../models/userModel');
const apperror = require('../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');

// Creating a multer storage
const multerstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

// Creating a multer filer
const multerfilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new apperror('Not an image! Please upload only images'), false);
  }
};

// configuration of multer
const upload = multer({ storage: multerstorage, fileFilter: multerfilter });
const uploaduserphoto = upload.single('photo');

// this function is used to filter the data passed as req.body ans only consider those fields which are part of allowed fields it is pure javascript not nodejs
const filterObj = (obj, ...allowedfields) => {
  const newobject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfields.includes(el)) newobject[el] = obj[el];
  });
  return newobject;
};

// getme middleware created
const getme = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
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

// updating the details of the user
const updateMe = catchasync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  // create error if user try to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new apperror(
        'This route if not for password updates.Please use /updatemypassowrd',
        400
      )
    );
  }
  // filtered out unwanted field names that are not allowed
  const filteredbody = filterObj(req.body, 'name', 'email');
  // update user document
  const userupdated = await User.findByIdAndUpdate(req.user.id, filteredbody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: userupdated,
    },
  });
});

// deleting the current user
const deleteMe = catchasync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    message: 'Account deleted(inactive) successfully',
    data: null,
  });
});
const creatuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet definded. Please use /signup instead',
  });
};

// const getuser = (req, res) => {
//   res
//     .status(500)
//     .json({ status: 'error', message: 'this route is not yet definded' });
// };

// the above get user code is commented and below handler fucntion of get user is implemented
const getuser = factory.getone(User);

// update user is implemented using factory handler
const updateuser = factory.updateone(User);

// delete user is implemented using factory handler
const deleteuser = factory.deleteone(User);
module.exports = {
  getme,
  getallusers,
  creatuser,
  getuser,
  updateuser,
  deleteuser,
  updateMe,
  deleteMe,
  uploaduserphoto,
};
