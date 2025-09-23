const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice'); // or your DB model

// GET /searchEngine?q=term
router.get('/', async (req, res) => {
  const query = req.query.q || '';
  
  try {
    // MongoDB text search OR regex search for large datasets
    const invoices = await Invoice.find({
      $or: [
        { invoiceNumber: { $regex: query, $options: 'i' } },
        { clientName: { $regex: query, $options: 'i' } },
        { clientEmail: { $regex: query, $options: 'i' } },
      ]
    }).limit(100); // limit results for performance

    res.json({ success: true, data: invoices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

module.exports = router;
