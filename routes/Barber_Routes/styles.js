const express = require('express');
const router = express.Router();
const BarberShop = require('../../model/barber/shop') // Adjust the path to your BarberShop model

router.post('/', async (req, res) => {
  try {
    const { barberNames, selectedStyles, uniqueId } = req.body;
    console.log(barberNames, selectedStyles, uniqueId);

    // Validate input
    if (!barberNames || !Array.isArray(barberNames) || barberNames.length === 0) {
      return res.status(400).json({ error: "All barber names are required." });
    }
    if (!selectedStyles || !Array.isArray(selectedStyles) || selectedStyles.length === 0) {
      return res.status(400).json({ error: "At least one style must be selected." });
    }
    if (!uniqueId) {
      return res.status(400).json({ error: "Unique ID is required." });
    }

    // Find the shop by uniqueId and update barberNames and selectedStyles
    const updatedShop = await BarberShop.findOneAndUpdate(
      { uniqueId: uniqueId }, // Find by uniqueId
      { $set: { barberNames, selectedStyles } }, // Update the fields
      { new: true } // Return the updated document
    );

    if (!updatedShop) {
      return res.status(404).json({ error: "Shop not found." });
    }

    res.status(200).json({ message: "Barber details updated successfully!", shop: updatedShop });
  } catch (err) {
    console.error("Error updating barber details:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;