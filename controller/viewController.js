const Tour = require('../models/tourModels');
const catchasync = require('../utils/catchAsync');
const getoverview = catchasync(async (req, res, next) => {
  // 1. Get tour data from collection
  const tours = await Tour.find();
  // 2. Build  template
  // 3. Render that template using the tour data
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});
const gettour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forset Hiker',
  });
};
module.exports = { getoverview, gettour };
