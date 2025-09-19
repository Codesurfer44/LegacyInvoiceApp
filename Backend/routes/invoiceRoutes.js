// Backend/routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { validateInvoice } = require('../utils/validateRequest');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, invoiceController.getAllInvoices);
router.get('/:id', authenticate, invoiceController.getInvoiceById);
router.post('/', authenticate, validateInvoice, invoiceController.createInvoice);
router.put('/:id', authenticate, validateInvoice, invoiceController.updateInvoice);
router.delete('/:id', authenticate, invoiceController.deleteInvoice);

module.exports = router;