const express = require('express');
const toursrouter = express.Router();
const tourcontroller = require('../controller/tourController');
// param midlleware
// toursrouter.param('id', tourcontroller.checkid);
toursrouter
  .route('/')
  .get(tourcontroller.getalltours)
  .post(tourcontroller.checkbody, tourcontroller.createnewtour);
toursrouter
  .route('/:id')
  .get(tourcontroller.getaparticulartour)
  .patch(tourcontroller.updatetour)
  .delete(tourcontroller.deletetour);
module.exports = toursrouter;
