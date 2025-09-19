// app.js

const express = require('express');
const cors = require('cors');           // Allow cross-origin requests
const morgan = require('morgan');       // Optional: HTTP request logging
const invoiceRoutes = require('./routes/invoiceRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(cors());             // Enable CORS for frontend access
app.use(express.json());     // Parse JSON request bodies
app.use(morgan('dev'));      // Log requests (optional)

// ----------------------
// Routes
// ----------------------
app.use('/api/invoices', invoiceRoutes);

// ----------------------
// Health Check Route
// ----------------------
app.get('/', (req, res) => {
  res.send('Invoice API is running');
});

// ----------------------
// Centralized Error Handling
// ----------------------
app.use(errorHandler);

module.exports = app;
