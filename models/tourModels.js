const mongoose = require('mongoose');
// This is the schema for  the tour accoding to which we have to provide data for the time it is temporary and will be updated in future if required
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// We have included our tourschema into tour and this will be used for providing data to the mongodb database
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
