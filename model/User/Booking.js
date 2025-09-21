// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true },
  barberId: { type: String, required: true },
  styleId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userPhoneNumber: { type: String, required: true },
  userEmail: { type: String, required: true },
  shopName: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true },
  barberName: { type: String, required: true },
  timing: { type: String, required: true },
  timingUnit: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now }, // New field for booking date
  status: { type: String, enum: ["pending", "completed"], default: "pending" }, // New field for status
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);