const fs = require('fs');
// Reading the tours-simple json file and including it in var tours
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
const Tour = require('../models/tourModels');
const apifeatures = require('../utils/apiFeatures.js');
const catchasync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const factory = require('./handlerFactory');
// created a middleware for functioning of endpoint named as top-5-cheaptours and in this middle ware we are passing default values for limit sort and fields
const aliastoptours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// checkid as a param middleware
// const checkid = (req, res, next, val) => {
//   console.log(`Tour id is : ${val}`);
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({ status: 'faild', message: 'invalid id' });
//   }
//   next();
// };

// No longer needed
// const checkbody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'failed', message: 'missing name and price' });
//   }
//   next();
// };

// we made a custom fucntion for the get request and now instead of writing same code and on singele fucntion we can import this directly
// and also we have included the custom middleware 2 which will return the time

const getalltours = catchasync(async (req, res, next) => {
  // ********PASSING OR MAKING QUERY*************
  // There are two ways for passing query into database and retreiving data based on query
  // Method-1
  // const alltours = await Tour.find({
  //   duration: 5,
  //   difficulty: 'easy',
  // });
  // Method-2
  // const alltours = await Tour.find(req.query);
  // Now from both these methods method 2 is much more convivenet as there is no static query being passed which will help user to search according to query that being pass on time

  const features = new apifeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limiting()
    .pagination();
  const alltours = await features.query;

  // ********SENDING RESPONSE*********
  res.status(200).json({
    status: 'success',
    result: alltours.length,
    data: {
      alltours,
    },
  });
});

// const createnewtour = catchasync(async (req, res, next) => {
//   const newtour = await Tour.create(req.body);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: newtour,
//     },
//   });
// });

// the above create tour code is commented and below handler fucntion create tour is implemented
const createnewtour = factory.createone(Tour);

// similary we have done for the post request
// const getaparticulartour = catchasync(async (req, res, next) => {
//   // req.params - it will access the value that the user is passing as a argument
//   // and also populate the reviews that are associated with it
//   const singletour = await Tour.findById(req.params.id).populate('reviews');
//   if (!singletour) {
//     return next(new appError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: singletour,
//     },
//   });
// const tour = tours.find((el) => el.id == id);
// if (id > tours.length) {
//   return res.status(404).json({ status: 'faild', message: 'invalid id' });
// }
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour,
//   },
// });
// });

// the above get particular tour code is commented and below handler fucntion of get particular tour is implemented
const getaparticulartour = factory.getone(Tour, { path: 'reviews' });

// const updatetour = catchasync(async (req, res, next) => {
//   const tourupdate = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tourupdate) {
//     return next(new appError('No tour with that ID exist', 404));
//   }
//   res.status(200).json({ status: 'success', data: tourupdate });
// });

// the above update tour code is commented and below handler fucntion update tour is implemented
const updatetour = factory.updateone(Tour);

// const deletetour = catchasync(async (req, res, next) => {
//   const tourdelete = await Tour.findByIdAndDelete(req.params.id);
//   if (!tourdelete) {
//     return next(new appError('No tour with that ID exist', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: tourdelete,
//     message: 'Particular tour has been successfully deleted',
//   });
// });

// the above delete tour code is commented and below handler fucntion delete tour is implemented
const deletetour = factory.deleteone(Tour);

// Implementing aggregation pipeline
const gettourstats = catchasync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numberoftous: { $sum: 1 },
        totalratings: { $sum: '$ratingsQuantity' },
        avgrating: { $avg: '$ratingsAverage' },
        avgprice: { $avg: '$price' },
        minprice: { $min: '$price' },
        maxprice: { $max: '$price' },
      },
    },
    {
      $sort: {
        numberoftours: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

// Implementing more functionality of aggregation pipeline
const getmonthlyplans = catchasync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numtourstarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numtourstarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    result: plan.length,
    data: plan,
  });
});

// Finding tours within a radius
const gettourswithin = catchasync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    next(
      new appError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }
  // converting the distance into radians
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  console.log(distance, lat, lng, unit);
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

// Calculating the distances of all tours from a given point
const getdistance = catchasync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new appError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      distances,
    },
  });
});
module.exports = {
  getalltours,
  createnewtour,
  updatetour,
  deletetour,
  getaparticulartour,
  aliastoptours,
  gettourstats,
  getmonthlyplans,
  gettourswithin,
  getdistance,
};

// This is discarded in further developement process as it uses the local json file for fetching and updating the data
/*
const createnewtour = (req, res) => {
  // finding the newid number using the tourlength +1
  const newid = tours[tours.length - 1].id + 1;
  // here it will store the newtour passed through postman in json format when the post request made and assign the id and details to the var newtour and then push the new tour into the tours where all the previous tours are stored
  const newtour = Object.assign({ id: newid }, req.body);
  tours.push(newtour);
  // this section is reponsible for updating the tours-simple json file with the new tour entry then will be made by post request
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          // this will the new entry made as the post request hit
          tour: newtour,
          // this will show the all the entries
          // tours,
        },
      });
    }
  );
};
 */
