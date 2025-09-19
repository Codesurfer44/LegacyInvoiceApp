// Backend/routes/invoiceRoutes.js

const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { validateInvoice } = require('../utils/validateRequest'); // validation function
const { authenticate } = require('../middleware/authMiddleware'); // optional JWT auth

// GET /api/invoices
// Get all invoices (optionally authenticated)
router.get('/', authenticate, invoiceController.getAllInvoices);

// GET /api/invoices/:id
// Get a single invoice by ID
router.get('/:id', authenticate, invoiceController.getInvoiceById);

// POST /api/invoices
// Create a new invoice
router.post('/', authenticate, validateInvoice, invoiceController.createInvoice);

// PUT /api/invoices/:id
// Update an existing invoice
router.put('/:id', authenticate, validateInvoice, invoiceController.updateInvoice);

// DELETE /api/invoices/:id
// Delete an invoice
router.delete('/:id', authenticate, invoiceController.deleteInvoice);

module.exports = router;
