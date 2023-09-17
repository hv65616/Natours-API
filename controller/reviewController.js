const Review = require('../models/reviewModels');
const catchasync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const getallreviews = catchasync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourid) filter = { tour: req.params.tourid };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const createreviews = catchasync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user._id;
  const newreview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newreview,
    },
  });
});
// delete review with handler function
const deletereview = factory.deleteone(Review);
// update review with handler function
const updatereview = factory.updateone(Review);
module.exports = { getallreviews, createreviews, deletereview, updatereview };
