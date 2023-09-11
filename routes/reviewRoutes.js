const express = require('express');
const reviewrouter = express.Router();
const reviewcontroller = require('../controller/reviewController');
const authcontroller = require('../controller/authController');
reviewrouter
  .route('/')
  .get(reviewcontroller.getallreviews)
  .post(
    authcontroller.protect,
    authcontroller.restrictto('user'),
    reviewcontroller.createreviews
  );
module.exports = reviewrouter;
