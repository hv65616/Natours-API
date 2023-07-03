const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty is either: easy,medium,difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    pricediscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdate: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Here we define the virtual properties to calculating weeks by using duration in number of days
// Virtual properties is used when we can drive anything from anything so as to save space and also we cannot pass this in query as this is not a part of query schema and not present in database
tourSchema.virtual('durationweeks').get(function () {
  return this.duration / 7;
});

// document middleware : runs before the save command and create command
// the pre middleware used to execite before we save any document of save command execute
tourSchema.pre('save', function (next) {
  // console.log(this);
  // the slugify used here is used to extract name from the document that is being saved and store it seperate in scheme be defining seperate in schema
  this.slug = slugify(this.name, { lower: true });
  next();
});

// post also perform the same but it execute after document being saved
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// query middleware: used to run before and after executing a query
// there are two ways pre and post pre is used to run before executing a query and used to find the result with the object specify to it while post is used to find result after executing query
// we use regex to avoid bug like where secret is set to true but if you search by id it give us the output so for that we use regex which will avoid all the find function start with find to exectute for secret
/* 
tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.pre('findOne', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
*/
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  // console.log(docs);
  next();
});

// Aggregation middleware
// this middleware used to hide data from the pipeline of all the data where the object specified is true
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

// trim remove all the whitespace from starting and from end

// This is the schema for  the tour accoding to which we have to provide data for the time it is temporary and will be updated in future if required

// Its better to define variable names as you are using in passing in from json format so as to avoid any data to get missed

// If you have set required as true and you are passing differnt variable name differnet in model and different in passing data json if a change of lower and upper is there it will show error

// We have included our tourschema into tour and this will be used for providing data to the mongodb database
