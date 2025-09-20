const express = require('express');
const router = express.Router();
const BarberTimings = require('../../model/barber/time');

// GET barber details and styles by barberId, with optional maxTiming filter
router.get('/reamingtime', async (req, res) => {
  const { barberId, maxTiming } = req.query;

  try {
    // Validate required parameters
    if (!barberId) {
      return res.status(400).json({ message: 'barberId is required' });
    }

    // Find barber by barberId
    const barber = await BarberTimings.findOne({ barberId });

    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }

    // If maxTiming is provided, filter styles based on remaining time
    if (maxTiming) {
      const maxTimingValue = parseInt(maxTiming, 10);
      if (isNaN(maxTimingValue) || maxTimingValue <= 0) {
        return res.status(400).json({ message: 'maxTiming must be a positive integer' });
      }

      // Filter styles where duration is <= maxTiming
      const matchingStyles = barber.styles.filter((style) => {
        const styleTimingValue = parseInt(style.timing.value.split(':')[1], 10);
        return styleTimingValue <= maxTimingValue;
      });

      // Prepare response
      const response = {
        barberId: barber.barberId,
        name: barber.name,
        uniqueId: barber.uniqueId,
        styles: matchingStyles.map((style) => ({
          styleId: style.styleId,
          style: style.style,
          timing: style.timing,
        })),
      };

      // Add message if no styles match
      if (matchingStyles.length === 0) {
        response.message = `No available styles for maxTiming of ${maxTimingValue} minutes. All styles require more time than the remaining time in the slot.`;
      }

      return res.status(200).json(response);
    }

    // If no maxTiming, return all barber styles
    res.status(200).json({
      barberId: barber.barberId,
      name: barber.name,
      uniqueId: barber.uniqueId,
      styles: barber.styles,
    });
  } catch (err) {
    console.error('Error fetching barber timings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;