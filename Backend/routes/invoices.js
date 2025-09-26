const express = require('express');
const router = express.Router();
const pool = require('../db');

function toCamel(row) {
  const map = {
    id: 'id',
    invoicenumber: 'invoiceNumber',
    clientname: 'clientName',
    clientemail: 'clientEmail',
    amount: 'amount',
    description: 'description',
    invoicedate: 'invoiceDate',
    duedate: 'dueDate',
    currency: 'currency',
    status: 'status',
    createdat: 'createdAt',
  };
  const out = {};
  for (const k in row) {
    const nk = map[k] || k;
    let v = row[k];
    if (nk === 'amount' && v != null) v = Number(v);
    out[nk] = v;
  }
  return out;
}

// GET all
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT id, invoicenumber, clientname, clientemail, amount, description,
             invoicedate, duedate, currency, status, createdat
      FROM invoices
      ORDER BY createdat DESC
    `;
    const { rows } = await pool.query(sql);
    res.json(rows.map(toCamel));
  } catch (e) {
    console.error('GET /api/invoices error:', e);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// IMPORTANT: place this before '/:id'
router.get('/last-number', async (req, res) => {
  try {
    const sql = `
      SELECT invoicenumber, createdat
      FROM invoices
      ORDER BY createdat DESC
      LIMIT 1
    `;
    const { rows } = await pool.query(sql);
    const lastInvoiceNumber = rows[0]?.invoicenumber || null;
    let lastNumber = null;
    if (lastInvoiceNumber) {
      const m = String(lastInvoiceNumber).match(/(\d+)\s*$/);
      if (m) lastNumber = parseInt(m[1], 10);
    }
    res.json({ lastNumber, lastInvoiceNumber });
  } catch (e) {
    console.error('GET /api/invoices/last-number error:', e);
    res.status(500).json({ error: 'Failed to fetch last invoice number' });
  }
});

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const sql = `
      SELECT id, invoicenumber, clientname, clientemail, amount, description,
             invoicedate, duedate, currency, status, createdat
      FROM invoices
      WHERE id = $1
    `;
    const { rows } = await pool.query(sql, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(toCamel(rows[0]));
  } catch (e) {
    console.error('GET /api/invoices/:id error:', e);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const sql = `
      INSERT INTO invoices (
        invoicenumber, clientname, clientemail, amount, description,
        invoicedate, duedate, currency, status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, invoicenumber, clientname, clientemail, amount, description,
                invoicedate, duedate, currency, status, createdat
    `;
    const params = [
      data.invoiceNumber,
      data.clientName,
      data.clientEmail,
      data.amount,
      data.description,
      data.invoiceDate,
      data.dueDate,
      data.currency,
      data.status || 'Pending',
    ];
    const { rows } = await pool.query(sql, params);
    res.json({ message: 'Invoice created', invoice: toCamel(rows[0]) });
  } catch (e) {
    console.error('POST /api/invoices error:', e);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const sql = `DELETE FROM invoices WHERE id = $1`;
    const { rowCount } = await pool.query(sql, [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (e) {
    console.error('DELETE /api/invoices/:id error:', e);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

module.exports = router;
