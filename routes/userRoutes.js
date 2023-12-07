const express = require('express');
const multer = require("multer");
const userrouter = express.Router();
const usercontroller = require('../controller/userController');
// Adding the route for the creating user
const authcontroller = require('../controller/authController');

// configuration of multer
const upload = multer({dest:'public/img/users'})
// route for signup
userrouter.post('/signup', authcontroller.signup);
// route for login
userrouter.post('/login', authcontroller.login);
// route for logout
userrouter.get('/logout', authcontroller.logout);
// route for forgot password
userrouter.post('/forgotpassword', authcontroller.forgotpassword);
// route for reset password
userrouter.patch('/resetpassword/:token', authcontroller.resetpassword);
// route for updating password
userrouter.patch(
  '/updatemypassword',
  authcontroller.protect,
  authcontroller.updatepassword
);

userrouter.get(
  '/me',
  authcontroller.protect,
  usercontroller.getme,
  usercontroller.getuser
);
// route for updating the user details apart from password
userrouter.patch('/updateMe', upload.single('photo'),authcontroller.protect, usercontroller.updateMe);
// route for deleting the user i.e marking it as inactive
userrouter.delete('/deleteMe', authcontroller.protect, usercontroller.deleteMe);
// route for getallusers and createusers
userrouter
  .route('/')
  .get(
    authcontroller.protect,
    authcontroller.restrictto('admin'),
    usercontroller.getallusers
  )
  .post(
    authcontroller.protect,
    authcontroller.restrictto('admin'),
    usercontroller.creatuser
  );
// route for particular user,update user and delete user
userrouter
  .route('/:id')
  .get(authcontroller.protect, usercontroller.getuser)
  .patch(authcontroller.protect, usercontroller.updateuser)
  .delete(authcontroller.protect, usercontroller.deleteuser);
module.exports = userrouter;
