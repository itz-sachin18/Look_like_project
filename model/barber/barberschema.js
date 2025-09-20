const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adminId: { type: String, required: true },
});

module.exports = mongoose.model('newadmins', barberSchema); // Ensure this line exists