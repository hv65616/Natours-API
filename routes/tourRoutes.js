const express = require('express');
const toursrouter = express.Router();
const tourcontroller = require('../controller/tourController');
const authcontroller = require('../controller/authController');
// param midlleware
// toursrouter.param('id', tourcontroller.checkid);

//middleware for finding top 5 cheap tours
toursrouter
  .route('/top-5-cheaptours')
  .get(tourcontroller.aliastoptours, tourcontroller.getalltours);
toursrouter.route('/tour-stats').get(tourcontroller.gettourstats);
toursrouter.route('/monthly-plan/:year').get(tourcontroller.getmonthlyplans);
toursrouter
  .route('/')
  // protect middleware to make user login before and check user before getting all tours
  .get(authcontroller.protect, tourcontroller.getalltours)
  .post(tourcontroller.createnewtour);
toursrouter
  .route('/:id')
  .get(tourcontroller.getaparticulartour)
  .patch(tourcontroller.updatetour)
  // restrictto middleware to check the role of user before deleting the tour
  .delete(
    authcontroller.protect,
    authcontroller.restrictto('admin', 'leadguide'),
    tourcontroller.deletetour
  );
module.exports = toursrouter;
