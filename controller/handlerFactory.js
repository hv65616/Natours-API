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

const updateone = (Model) =>
  catchasync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new appError('No tour with that ID exist', 404));
    }
    res.status(200).json({ status: 'success', data: doc });
  });

const createone = (Model) =>
  catchasync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

const getone = (Model, popOptions) =>
  catchasync(async (req, res, next) => {
    // first we model the query and if query consist some result then
    let query = Model.findById(req.params.id);
    // then it populate it with the popoptions
    if (popOptions) query = query.populate(popOptions);
    // and at last await the query to get it resolved
    const doc = await query;
    if (!doc) {
      return next(new appError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
module.exports = { deleteone, updateone, createone, getone };
