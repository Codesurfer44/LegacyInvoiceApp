// controllers/invoiceController.js

const Invoice = require('../models/Invoice');

// Helper to calculate totals
const calculateTotals = (items, tax = 0, discount = 0) => {
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const total = subtotal + tax - discount;
  return { subtotal, total };
};

// GET /api/invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/invoices/:id
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/invoices
exports.createInvoice = async (req, res) => {
  try {
    const { items, tax = 0, discount = 0 } = req.body;
    const { subtotal, total } = calculateTotals(items, tax, discount);

    const invoice = new Invoice({
      ...req.body,
      subtotal,
      tax,
      discount,
      total,
    });

    await invoice.save();
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate invoiceNumber
      return res.status(400).json({ success: false, message: 'Invoice number must be unique' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/invoices/:id
exports.updateInvoice = async (req, res) => {
  try {
    const { items, tax = 0, discount = 0 } = req.body;
    const { subtotal, total } = calculateTotals(items, tax, discount);

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, subtotal, tax, discount, total },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: updatedInvoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/invoices/:id
exports.deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
