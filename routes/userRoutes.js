const express = require('express');
const userrouter = express.Router();
const usercontroller = require('../controller/userController');
// Adding the route for the creating user
const authcontroller = require('../controller/authController');
// route for signup
userrouter.post('/signup', authcontroller.signup);
// route for login
userrouter.post('/login', authcontroller.login);
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
