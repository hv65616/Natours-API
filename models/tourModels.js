const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
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
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy,medium,difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on the new document creation
          if (val < this.price) return true;
          else return false;
        },
        message: 'Discount price should be below regular price',
      },
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
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      descriptions: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // this way of storing guides is referencing
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// indexing on tour schema will align data according to that price=1 means arrange data in decreasing price
// This will reduce the search time as data become sorted
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// Here we define the virtual properties to calculating weeks by using duration in number of days
// Virtual properties is used when we can drive anything from anything so as to save space and also we cannot pass this in query as this is not a part of query schema and not present in database
tourSchema.virtual('durationweeks').get(function () {
  return this.duration / 7;
});

// this virtual populate, populate the reviews with out any taking extra memory
// it have 3 things specified ref i.e to whom we are refering , foreign field that will be accorind to the referencing and local field that will belogn to locally
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
// document middleware : runs before the save command and create command
// the pre middleware used to execite before we save any document of save command execute
tourSchema.pre('save', function (next) {
  // console.log(this);
  // the slugify used here is used to extract name from the document that is being saved and store it seperate in scheme be defining seperate in schema
  this.slug = slugify(this.name, { lower: true });
  next();
});
// this pre middleware is used for embedding the guides data from user model to tour model before saving any tour
// tourSchema.pre('save', async function (next) {
//   const guidespromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidespromises);
//   next();
// });

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
// this query middleware is used to populate the guides whose reference stored in tour schema along with that it deselect the parameters passed in select option
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
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
