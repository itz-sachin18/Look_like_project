// const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

// // Define the schema for the barber shop
// const shopSchema = new mongoose.Schema(
//   {
//     adminId: { type: String, required: true }, // Admin ID associated with the shop
//     uniqueId: { type: Number, unique: true }, // Auto-incremented unique ID
//     email: { type: String, required: true, unique: true }, // Shop owner's email
//     ownerName: { type: String, required: true }, // Shop owner's name
//     ownerContact: { type: String, required: true }, // Shop owner's contact number
//     shopName: { type: String, required: true, unique: true }, // Unique shop name
//     description: { type: String }, // Description of the shop
//     openHours: { type: String }, // Opening hours of the shop
//     address: { type: String, required: true }, // Shop address
//     feedback: [
//       {
//         comment: { type: String }, // Feedback comment
//         rating: { type: Number }, // Feedback rating
//         date: { type: Date, default: Date.now }, // Feedback date
//       },
//     ],
//     barberNames: { type: [String], required: true }, // List of barber names
//     selectedStyles: { type: [String], required: true }, // List of selected styles
//   },
//   { timestamps: true } // Automatically add createdAt and updatedAt fields
// );

// // Add auto-increment plugin for uniqueId
// shopSchema.plugin(AutoIncrement, { inc_field: "uniqueId" });

// // Create and export the BarberShop model
// module.exports = mongoose.model("newshops", shopSchema);

const mongoose = require("mongoose");

// Define the schema for the barber shop
const shopSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true }, // Admin ID associated with the shop
    uniqueId: { type: String, unique: true }, // Unique ID referencing _id
    email: { type: String, required: true, unique: true }, // Shop owner's email
    ownerName: { type: String, required: true }, // Shop owner's name
    ownerContact: { type: String, required: true }, // Shop owner's contact number
    shopName: { type: String, required: true, unique: true }, // Unique shop name
    description: { type: String }, // Description of the shop
    openHours: { type: String }, // Opening hours of the shop
    address: { type: String, required: true }, // Shop address
    feedback: [
      {
        comment: { type: String }, // Feedback comment
        rating: { type: Number }, // Feedback rating
        date: { type: Date, default: Date.now }, // Feedback date
      },
    ],
    barberNames: { type: [String], required: true }, // List of barber names
    selectedStyles: { type: [String], required: true }, // List of selected styles
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Pre-save middleware to set uniqueId to _id
shopSchema.pre("save", function (next) {
  if (this.isNew) {
    this.uniqueId = this._id.toString(); // Set uniqueId to the string value of _id
  }
  next();
});

// Create and export the BarberShop model
module.exports = mongoose.model("newshops", shopSchema);