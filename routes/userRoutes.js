const express = require('express');
const userrouter = express.Router();
const usercontroller = require('../controller/userController');
// Adding the route for the creating user
const authcontroller = require('../controller/authController');
// route for signup
userrouter.post('/signup', authcontroller.signup);
// route for login
userrouter.post('/login', authcontroller.login);
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
userrouter.patch('/updateMe', authcontroller.protect, usercontroller.updateMe);
// route for deleting the user i.e marking it as inactive
userrouter.delete('/deleteMe', authcontroller.protect, usercontroller.deleteMe);
// route for getallusers and createusers
userrouter
  .route('/')
  .get(usercontroller.getallusers)
  .post(usercontroller.creatuser);
// route for particular user,update user and delete user
userrouter
  .route('/:id')
  .get(usercontroller.getuser)
  .patch(usercontroller.updateuser)
  .delete(usercontroller.deleteuser);
module.exports = userrouter;
