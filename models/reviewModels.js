const mongoose = require('mongoose');
const Tour = require('./tourModels');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A tour must have a review'],
    },
    rating: {
      type: Number,
      required: [true, 'A tour must have a rating'],
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  //   the use of this virtual property it to show data or the fields when we are not storing any field directly into database
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// populating the data of tour and user in the review by parent referencing -
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'tour',
//     select: 'name',
//   }).populate({
//     path: 'user',
//     select: 'name photo',
//   });
//   next();
// });

// populating the data of user only as we are using virtaul populate also child referencing
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// calcAverageRating is a middleware that is used to calculate the averahe rating on a particular tour and then update the rating
reviewSchema.statics.calcAverageRatings = async function (tourid) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourid },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // check if there are no review record are present or present
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourid, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourid, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }

  // console.log(stats);
};

reviewSchema.pre('save', function (next) {
  // this point to current review
  this.constructor.calcAverageRatings(this.tour);
  next();
});

// this middleware is used to find a review , update it or delete it
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
