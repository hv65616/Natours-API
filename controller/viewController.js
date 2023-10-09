const Tour = require('../models/tourModels');
const catchasync = require('../utils/catchAsync');
const getoverview = catchasync(async (req, res, next) => {
  // 1. Get tour data from collection
  const tours = await Tour.find();
  // 2. Build  template
  // 3. Render that template using the tour data
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});
const gettour = async (req, res) => {
  // 1. get data for the requested tour(including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  // 2.Build template
  // 3. Render the template using data from step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
};
module.exports = { getoverview, gettour };
