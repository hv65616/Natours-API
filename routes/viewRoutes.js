const express = require('express');
const router = express.Router();
const viewcontroller = require('../controller/viewController');
const authcontroller = require('../controller/authController');
// router.use(authcontroller.isloggedin);
// Overview route to get all tour
router.get('/overview', authcontroller.isloggedin,viewcontroller.getoverview);
// Tour route to get particular tour
router.get('/tour/:slug', authcontroller.isloggedin, viewcontroller.gettour);
// router.get('/tour/:slug',viewcontroller.gettour);
router.get('/login', authcontroller.isloggedin,viewcontroller.getloginform);
// User Profile route
router.get("/me",authcontroller.protect,viewcontroller.getaccount);
module.exports = router;
