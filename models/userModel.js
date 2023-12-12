// Creating the schema for the user which allow user to store their data
// We are also using validator to validate the email provided by the user is correct or not
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'leadguide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Please provide a password of minimum 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on save
      // Its a custom validator which is used to validate the password
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password and Password confirm does not match',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  // This store the password reset token
  passwordResetToken: {
    type: String,
  },
  // And this store the password reset expires
  passwordResetExpires: {
    type: Date,
  },
  // set the account property is active or not which help in deactivating or deleting account
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
// this middle ware function is used to encrypt the password before saving it into the database
userSchema.pre('save', async function (next) {
  // Only run this function if password is actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Does not store the passwordconfirm into the database
  this.passwordConfirm = undefined;
  next();
});
// this middleware function is used to update the password changed at when ever user changes the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// this middleware runs on all the function that start with find when quering in database and then return all the account which are active
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});
// Instance method - it is a method that will be available in all documents of a certain collection
// this instance method is for checking the entered password and stored password are same and correct
userSchema.methods.correctPassword = async function (
  candidatepassword,
  userpassword
) {
  return await bcrypt.compare(candidatepassword, userpassword);
};
// This instance method is used to check whether the user changed its password or not and that could help to avoid using the expired jwt token and it will not be async
userSchema.methods.changedPasswordAfter = function (jwttimestamp) {
  if (this.passwordChangedAt) {
    const changedtimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwttimestamp < changedtimestamp;
  }
  return false;
};
// This instance method is responsible for generating a password reset token and then transfer that to forget password endpoint and from there it get saved into the database
userSchema.methods.createpasswordresettoken = function () {
  const resettoken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest('hex');
  console.log({ resettoken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resettoken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
