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

async function searchHandler(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const like = `%${q}%`;
    const sql = `
      SELECT id, invoicenumber, clientname, clientemail, amount, description,
             invoicedate, duedate, currency, status, createdat
      FROM invoices
      WHERE invoicenumber ILIKE $1
         OR clientname   ILIKE $1
         OR clientemail  ILIKE $1
         OR description  ILIKE $1
         OR status       ILIKE $1
      ORDER BY createdat DESC
      LIMIT 100
    `;
    const { rows } = await pool.query(sql, [like]);
    res.json(rows.map(toCamel));
  } catch (err) {
    console.error('search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
}

router.get('/search', searchHandler);
router.get('/searchEngine', searchHandler);

module.exports = router;
