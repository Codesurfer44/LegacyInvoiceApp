const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());

// Mount API routes before static if you prefer; both orders work when paths don’t collide
const invoiceRoutes = require('./routes/invoices'); // we’ll add/replace this file next
const searchRoutes = require('./routes/search'); // we’ll create this file next
app.use('/api/invoices', invoiceRoutes);
app.use('/api', searchRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// Page routes
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '..', 'Frontend', 'index.html'));
});

app.get('/invoiceDatabase', (req, res) => {
res.sendFile(path.join(__dirname, '..', 'Frontend', 'invoiceDatabase.html'));
});

app.listen(PORT, HOST, () => {
console.log(🚀 Server running at http://${HOST}:${PORT});
});
