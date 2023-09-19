const express = require('express');
// merge params is used to merge or use the params pass in another route to in its route
const reviewrouter = express.Router({ mergeParams: true });
const reviewcontroller = require('../controller/reviewController');
const authcontroller = require('../controller/authController');
reviewrouter
  .route('/')
  .get(authcontroller.protect, reviewcontroller.getallreviews)
  .post(
    authcontroller.protect,
    authcontroller.restrictto('user'),
    reviewcontroller.createreviews
  );
reviewrouter
  .route('/:id')
  .get(authcontroller.protect, reviewcontroller.getreview)
  .patch(
    authcontroller.protect,
    authcontroller.restrictto('user', 'admin'),
    reviewcontroller.updatereview
  )
  .delete(
    authcontroller.protect,
    authcontroller.restrictto('user', 'admin'),
    reviewcontroller.deletereview
  );
module.exports = reviewrouter;
