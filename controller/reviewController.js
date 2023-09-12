const Review = require('../models/reviewModels');
const catchasync = require('../utils/catchAsync');
const getallreviews = catchasync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const createreviews = catchasync(async (req, res, next) => {
  const newreview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newreview,
    },
  });
});
module.exports = { getallreviews, createreviews };