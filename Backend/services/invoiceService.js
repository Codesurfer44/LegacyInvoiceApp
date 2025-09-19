// services/invoiceService.js

const Invoice = require('../models/Invoice');

// Get all invoices
exports.getAll = async () => {
  return await Invoice.find().sort({ createdAt: -1 });
};

// Get invoice by ID
exports.getById = async (id) => {
  return await Invoice.findById(id);
};

// Get invoice by invoiceNumber
exports.getByNumber = async (invoiceNumber) => {
  return await Invoice.findOne({ invoiceNumber });
};

// Create invoice
exports.create = async (data) => {
  const invoice = new Invoice(data);
  return await invoice.save();
};

// Update invoice
exports.update = async (id, data) => {
  return await Invoice.findByIdAndUpdate(id, data, { new: true });
};

// Delete invoice
exports.delete = async (id) => {
  const result = await Invoice.findByIdAndDelete(id);
  return result !== null;
};