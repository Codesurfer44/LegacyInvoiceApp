// Backend/controllers/invoiceController.js
const Invoice = require('../models/Invoice');

const calculateTotals = (items, tax = 0, discount = 0) => {
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const total = subtotal + tax - discount;
  return { subtotal, total };
};

exports.createInvoice = async (req, res, next) => {
  console.log("REQ BODY:", req.body); // Debugging line to check the request body
  try {
    const { items, tax = 0, discount = 0 } = req.body;
    const { subtotal, total } = calculateTotals(items, tax, discount);

    const invoice = new Invoice({
      ...req.body,
      subtotal,
      total
    });

    const savedInvoice = await invoice.save();
    res.status(201).json({ success: true, data: savedInvoice });
  } catch (err) {
    next(err);
  }
};

exports.getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find();
    res.json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const { items, tax = 0, discount = 0 } = req.body;
    const { subtotal, total } = calculateTotals(items, tax, discount);

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, subtotal, total },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: updatedInvoice });
  } catch (err) {
    next(err);
  }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (err) {
    next(err);
  }
};