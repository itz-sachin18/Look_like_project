const express = require("express");
const router = express.Router();
const BarberShop = require("../../model/barber/shop"); // Adjust the path to your BarberShop model
const Shop = require("../../model/barber/shop"); // Adjust the path to your BarberShop model
const barbertimeings  = require('../../model/barber/time');

// Search Route
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Case-insensitive search
    const results = await BarberShop.find({ shopName: { $regex: query, $options: "i" } });

    res.json(results);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/barber-timings", async (req, res) => {
  try {
    const { uniqueId } = req.query; // Get uniqueId from query parameters
    if (!uniqueId) {
      return res.status(400).json({ message: "Unique ID is required" });
    }

    // Fetch all documents from barberTiming where uniqueId matches
    const barbers = await barbertimeings.find({ uniqueId });
    if (!barbers.length) {
      return res.status(404).json({ message: "No barbers found for this shop" });
    }

    res.json(barbers); // Return the matching barbers
  } catch (error) {
    console.error("Error fetching barber timings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Fetch styles for a shop by adminId
router.get('/styles', async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({ message: 'adminId is required' });
    }

    // Find the shop by adminId
    const shop = await BarberShop.findOne({ adminId });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Return all selectedStyles
    res.json({ styles: shop.selectedStyles || [] });
  } catch (error) {
    console.error('Error fetching styles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  const { adminId } = req.query;

  // Validate adminId
  if (!adminId) {
    return res.status(400).json({ message: "adminId query parameter is required" });
  }

  try {
    console.log(`Fetching barbers for adminId: ${adminId}`);
    // Find shop by adminId
    const shop = await Shop.findOne({ adminId });
    console.log('Shop found:', shop);

    if (!shop) {
      console.log(`No shop found for adminId: ${adminId}`);
      return res.status(404).json({ message: "Shop not found for the given adminId" });
    }

    console.log(`Barbers for adminId ${adminId}:`, shop.barberNames || []);
    res.status(200).json({ barbers: shop.barberNames || [] });
  } catch (error) {
    console.error('Error fetching barbers:', error.message, error.stack);
    res.status(500).json({ message: "Server error while fetching barbers", error: error.message });
  }
});



module.exports = router;