const express = require('express');
const userrouter = express.Router();
const usercontroller = require('../controller/userController');
// Adding the route for the creating user
const authcontroller = require('../controller/authController');
userrouter.post('/signup', authcontroller.signup);

userrouter
  .route('/')
  .get(usercontroller.getallusers)
  .post(usercontroller.creatuser);
userrouter
  .route('/:id')
  .get(usercontroller.getuser)
  .patch(usercontroller.updateuser)
  .delete(usercontroller.deleteuser);
module.exports = userrouter;
