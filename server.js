const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

// This middleware is responsible to handle uncaught exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION!!!!  Shutting Down');
  server.close(() => {
    process.exit(1);
  });
});

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

// Below code is used
// const testTour = new Tour({
//   name: 'The Park Campher',
//   rating: 4.7,
//   price: 497,
// });
// testTour.save().then(doc=>{
//   console.log(doc);
// }).catch(err=>{
//   console.log(err);
// })

const server = app.listen(port, () => {
  console.log('Server is listening on port 3000');
});

// This particular middleware will execute when we have any unhandled rejection in our application which further lead to closing the application
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!!!!  Shutting Down');
  server.close(() => {
    process.exit(1);
  });
});

// mongodb+srv://vermah564:<password>@cluster0.qpawwas.mongodb.net/Natours?retryWrites=true&w=majority

// npm run start:prod or start:dev
