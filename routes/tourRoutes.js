const express = require('express');
const toursrouter = express.Router();
const tourcontroller = require('../controller/tourController');
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
