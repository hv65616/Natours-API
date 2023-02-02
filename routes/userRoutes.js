const express = require('express');
const userrouter = express.Router();
const usercontroller = require('../controller/userController');
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
