const express = require('express');
const router = express.Router();
const viewcontroller = require('../controller/viewController');
// Overview route to get all tour
router.get('/overview', viewcontroller.getoverview);
// Tour route to get particular tour
router.get('/tour/:slug', viewcontroller.gettour);
module.exports = router;
