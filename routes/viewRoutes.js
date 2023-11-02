const express = require('express');
const router = express.Router();
const viewcontroller = require('../controller/viewController');
const authcontroller = require('../controller/authController');
router.use(authcontroller.isloggedin);
// Overview route to get all tour
router.get('/overview', viewcontroller.getoverview);
// Tour route to get particular tour
router.get('/tour/:slug', viewcontroller.gettour);
router.get('/login', viewcontroller.getloginform);
module.exports = router;
