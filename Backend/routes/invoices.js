const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Get all invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.getAll();
        res.json(invoices);
    } catch (err) {
        console.error('Error fetching invoices:', err);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

// Get last invoice number
router.get('/last-number', async (req, res) => {
    try {
        const lastNumber = await Invoice.getLastNumber();
        res.json({ lastNumber });
    } catch (err) {
        console.error('Error fetching last invoice number:', err);
        res.status(500).json({ error: 'Failed to fetch last invoice number' });
    }
});

// Get invoice by ID or number
router.get('/:id', async (req, res) => {
    try {
        const idParam = req.params.id;

        let invoice = null;
        if (/^\d+$/.test(idParam)) invoice = await Invoice.getById(idParam);
        if (!invoice) invoice = await Invoice.getByNumber(idParam);

        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        console.error('Error fetching invoice:', err);
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
});

// Create new invoice
router.post('/', async (req, res) => {
    try {
        const invoice = await Invoice.create(req.body);
        res.status(201).json({ message: 'Invoice created', invoice });
    } catch (err) {
        console.error('Error creating invoice:', err);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Invoice.delete(id);
        if (result.changes === 0) return res.status(404).json({ error: 'Invoice not found' });
        res.json({ message: 'Invoice deleted' });
    } catch (err) {
        console.error('Error deleting invoice:', err);
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
});

module.exports = router;
