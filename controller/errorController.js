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
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    senderrorfordev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    senderrorforprod(err, res);
  }
};
