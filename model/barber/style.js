const mongoose = require('mongoose');

const styleSchema = new mongoose.Schema({
  style: { type: String, required: true }, // Style name (e.g., Haircut, Shaving)
  timing: {
    value: { type: String, required: true }, // Time value, e.g., "00:30"
    unit: { type: String, required: true, enum: ['H', 'M'] } // Time unit (H for hours, M for minutes)
  },
  styleId: { type: String } // Add styleId field to store the _id
});

// Pre-save middleware to set styleId equal to _id
styleSchema.pre('save', function (next) {
  if (this._id) {
    this.styleId = this._id.toString(); // Set styleId to the _id of the style object
  }
  next();
});

module.exports = styleSchema;