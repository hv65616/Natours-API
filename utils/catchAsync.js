// goal of this catchasync is to catch all asynchronous errors

const catchasync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

module.exports = catchasync;