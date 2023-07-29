const appError = require('../utils/appError');

const senderrorfordev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const senderrorforprod = (err, res) => {
  // Operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or any other kind of error
  else {
    console.error('ERROR->', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!!!!!',
    });
  }
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
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    senderrorfordev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }
    senderrorforprod(error, res);
  }
};
