// controllers/invoiceController.js

const invoiceService = require('../services/invoiceService');

// GET /api/invoices
exports.getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getAll();
    res.status(200).json(invoices);
  } catch (err) {
    next(err); // send error to centralized error handler
  }
};

// GET /api/invoices/:id
exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (err) {
    next(err);
  }
};

// POST /api/invoices
exports.createInvoice = async (req, res, next) => {
  try {
    const invoiceData = req.body;
    const newInvoice = await invoiceService.create(invoiceData);
    res.status(201).json(newInvoice);
  } catch (err) {
    next(err);
  }
};

// PUT /api/invoices/:id
exports.updateInvoice = async (req, res, next) => {
  try {
    const updatedInvoice = await invoiceService.update(req.params.id, req.body);
    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(updatedInvoice);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/invoices/:id
exports.deleteInvoice = async (req, res, next) => {
  try {
    const deleted = await invoiceService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    next(err);
  }
};
