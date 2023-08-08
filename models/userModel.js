// Creating the schema for the user which allow user to store their data
// We are also using validator to validate the email provided by the user is correct or not
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
// Instance method - it is a method that will be available in all documents of a certain collection
// this instance method is for checking the entered password and stored password are same and correct
userSchema.methods.correctPassword = async function (
  candidatepassword,
  userpassword
) {
  return await bcrypt.compare(candidatepassword, userpassword);
};
// This instance method is used to check whether the user changed its password or not and that could help to avoid using the expired jwt token
userSchema.methods.changedPasswordAfter = async function (jwttimestamp) {
  if (this.passwordChangedAt) {
    const changedtimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwttimestamp < changedtimestamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
