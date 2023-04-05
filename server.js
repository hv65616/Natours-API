const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
// console.log(app.get('env'));
// console.log(process.env);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // The below code shows all connections request and messages and not necessary to console log
    // console.log(con.connection);
    console.log('DB connection successful');
  });

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

// Below code is used 
const testTour = new Tour({
  name: 'The Park Campher',
  rating: 4.7,
  price: 497,
});
testTour.save().then(doc=>{
  console.log(doc);
}).catch(err=>{
  console.log(err);
})

app.listen(port, () => {
  console.log('Server is listening on port 3000');
});

// mongodb+srv://vermah564:<password>@cluster0.qpawwas.mongodb.net/Natours?retryWrites=true&w=majority

// npm run start:prod or start:dev
