const express = require('express');
const toursrouter = express.Router();
const tourcontroller = require('../controller/tourController');
// param midlleware
// toursrouter.param('id', tourcontroller.checkid);

//middleware for finding top 5 cheap tours
toursrouter
  .route('/top-5-cheaptours')
  .get(tourcontroller.aliastoptours, tourcontroller.getalltours);
toursrouter.route("/tour-stats").get(tourcontroller.gettourstats)
toursrouter
  .route('/')
  .get(tourcontroller.getalltours)
  .post(tourcontroller.createnewtour);
toursrouter
  .route('/:id')
  .get(tourcontroller.getaparticulartour)
  .patch(tourcontroller.updatetour)
  .delete(tourcontroller.deletetour);
module.exports = toursrouter;
