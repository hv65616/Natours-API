const appError = require('../utils/appError');

const senderrorfordev = (req, err, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  console.error('ERROR->', err);
  // RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};
const senderrorforprod = (req, err, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // Operational error
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or any other kind of error
    console.error('ERROR->', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!!!!!',
    });
  }
  // RENDERED WEBSITE
  if (err.isOperational) {
    // Operational error
    // console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // Programming or any other kind of error

  console.error('ERROR->', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};
// This function is responsible to handle error of our mongoose
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new appError(message, 400);
};
// This function is responsible to handle error where our database contains duplicate values
const handleDuplicateErrorDB = (err) => {
  const messgae = `Duplicate field value ${err.keyValue.name}. Please use another value!!`;
  return new appError(messgae, 400);
};
// This function is responsible to handle error which occur due to invalid updation like violating any constraints
const handleValidationErrorDB = (err) => {
  const errorvalue = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data. ${errorvalue.join('.')}`;
  return new appError(message, 400);
};
// This function is responsible to handle error which occur when someone try to change the jwt
const handlejsonwebtokenerror = (err) => {
  return new appError('Invalid token. Please Login again.', 401);
};
// This function is responsible to handle error which occur when token get expired
const handletokenexpirederror = (err) => {
  return new appError('Your token is expired. Please login again', 401);
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    senderrorfordev(req, err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handlejsonwebtokenerror(error);
    }
    if (err.name === 'TokenExpiredError') {
      error = handletokenexpirederror(error);
    }
    senderrorforprod(req, error, res);
  }
};
