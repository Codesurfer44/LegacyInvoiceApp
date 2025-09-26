const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// GET /searchEngine?q=term
router.get('/', async (req, res) => {
  const query = req.query.q || '';
  
  try {
    // PostgreSQL text search using ILIKE for case-insensitive matching
    const searchResults = await Invoice.searchInvoices(query);
    
    res.json({ success: true, data: searchResults });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

module.exports = router;