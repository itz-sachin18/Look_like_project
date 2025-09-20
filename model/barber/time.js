const mongoose = require('mongoose');
const styleSchema = require('./style'); // Import the updated style schema

const barberSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true }, // Barber's unique identifier
  barberId: { type: String }, // Add barberId field to store the _id of the barber document
  name: { type: String, required: true }, // Barber's name
  styles: [styleSchema], // List of styles with timings
});

// Pre-save middleware for the barber schema to set barberId and ensure styleId is set for each style
barberSchema.pre('save', function (next) {
  // Set barberId to the _id of the barber document
  if (this._id) {
    this.barberId = this._id.toString();
  }

  // Ensure styleId is set for each style (already in your code)
  this.styles.forEach(style => {
    if (style._id && !style.styleId) {
      style.styleId = style._id.toString();
    }
  });
  next();
});

module.exports = mongoose.model('barbertimeings', barberSchema);