const express = require('express');
// merge params is used to merge or use the params pass in another route to in its route
const reviewrouter = express.Router({ mergeParams: true });
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
reviewrouter.route('/:id').delete(reviewcontroller.deletereview);
module.exports = reviewrouter;
