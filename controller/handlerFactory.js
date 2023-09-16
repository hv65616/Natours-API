// This factory handler is responsible to reduce the redundency of the same code which is doing same functionality again and again
// Here in this it basically take the model name from where we have to delete and then check with the id passed into it
const catchasync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const deleteone = (Model) =>
  catchasync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new appError('No document with that ID exist', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
      message: 'Particular document has been successfully deleted',
    });
  });
module.exports = { deleteone };
