const Tour = require('../models/tourModels');
const catchasync = require('../utils/catchAsync');
const apperror = require('../utils/appError');
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
const gettour = catchasync(async (req, res,next) => {
  // 1. get data for the requested tour(including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  // console.log(tour);
  if (!tour) {
    // console.log("Not found");
    return next(new apperror('There is no tour with that name', 404));
  }
  // 2.Build template
  // 3. Render the template using data from step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
const getloginform = catchasync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log Into Your Account',
  });
});
module.exports = { getoverview, gettour, getloginform };
