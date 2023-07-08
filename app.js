const express = require('express');
const app = express();
// morgan is an login dependency which is a 3rd party middleware
const morgan = require('morgan');
const toursrouter = require('./routes/tourRoutes');
const userrouter = require('./routes/userRoutes');
const apperror = require('./utils/appError');
const errorController = require('./controller/errorController');
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  // it basically show us what request you made what endpoint you hit what is its status and how much time it took and soon information
  app.use(morgan('dev'));
}

// this is a middleware
app.use(express.json());

// custom middleware-1
app.use((req, res, next) => {
  console.log('Custom Middleware');
  next();
});

// custom middleware-2
app.use((req, res, next) => {
  req.requesttime = new Date().toISOString();
  next();
});

// including router for the tours
app.use('/api/v1/tours', toursrouter);

// including the router for the users
app.use('/api/v1/user', userrouter);

// route for all invalid request and should always put atlast
app.all('*', (req, res, next) => {
  next(new apperror(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Simpel error handling middleware
app.use(errorController);

module.exports = app;

// get request for a end point that will return the data int json format
// app.get('/api/v1/tours', getalltours);

// post request for a end point that will used to send data to server and update it on the json file
// app.post('/api/v1/tours', createnewtour);

// /:id - this is a variable defineing technique where we can pass a value to a variable and obtain result accoding to that
// app.get('/api/v1/tours/:id', getaparticulartour);

// Put request update when any new entry id made while patch update the properties only
// the following patch request will currently do not update any record as we have to properly include it but it will show how the things work out
// app.patch('/api/v1/tours/:id', updatetour);

// delete request is used to delete data matching particular id
// app.delete('/api/v1/tours/:id', deletetour);

// app.route is a way to chaining same type of request all together
// app.route('/api/v1/tours').get(getalltours);

// get , post , delete etc are also middleware but these are particular fucntion middleware and the middle ware created by user are called in every sceneriao i.e it is applicable to everything and should included in top of other middleware
// if you write this after a particulare middleware e.g get and hit the get request then this middleware will not get executed
