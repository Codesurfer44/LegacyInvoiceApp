// Backend/models/Invoice.js
const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  items: { type: [invoiceItemSchema], required: true },
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['Pending', 'Paid', 'Draft', 'Sent'], default: 'Pending' },
  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  paymentMethod: { type: String, default: 'N/A' },
  notes: { type: String, default: '' },
  createdBy: { type: String, default: 'N/A' },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
