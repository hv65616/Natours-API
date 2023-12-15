const express = require('express');
const toursrouter = express.Router();
const tourcontroller = require('../controller/tourController');
const authcontroller = require('../controller/authController');
const reviewrouter = require('../routes/reviewRoutes');
// param midlleware
// toursrouter.param('id', tourcontroller.checkid);
// this is a way of implementing nested route using router directly
toursrouter.use('/:tourid/reviews', reviewrouter);
//middleware for finding top 5 cheap tours
toursrouter
  .route('/top-5-cheaptours')
  .get(tourcontroller.aliastoptours, tourcontroller.getalltours);
toursrouter.route('/tour-stats').get(tourcontroller.gettourstats);
toursrouter
  .route('/monthly-plan/:year')
  .get(
    authcontroller.protect,
    authcontroller.restrictto('admin', 'leadguide', 'guide'),
    tourcontroller.getmonthlyplans
  );
// this route is reponsible for finding tour within lat and lang
toursrouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourcontroller.gettourswithin);
// this route is responsible for calculating the distance of all tours from a given point
toursrouter
  .route('/distance/:latlng/unit/:unit')
  .get(tourcontroller.getdistance);
toursrouter
  .route('/')
  // protect middleware to make user login before and check user before getting all tours
  .get(tourcontroller.getalltours)
  .post(
    authcontroller.protect,
    authcontroller.restrictto('admin', 'leadguide'),
    tourcontroller.createnewtour
  );
toursrouter
  .route('/:id')
  .get(tourcontroller.getaparticulartour)
  .patch(
    authcontroller.protect,
    authcontroller.restrictto('admin', 'leadguide'),
    tourcontroller.uploadtourphoto,
    tourcontroller.resizetourimages,
    tourcontroller.updatetour
  )
  // restrictto middleware to check the role of user before deleting the tour
  .delete(
    authcontroller.protect,
    authcontroller.restrictto('admin', 'leadguide'),
    tourcontroller.deletetour
  );
module.exports = toursrouter;
