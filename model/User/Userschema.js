const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String }, // Field to store _id as a string
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true }
});

// Pre-save middleware to set userId to the stringified _id
userSchema.pre('save', function (next) {
  if (this._id && !this.userId) {
    this.userId = this._id.toString(); // Convert ObjectId to string
  }
  next();
});

module.exports = mongoose.model('newUser', userSchema);