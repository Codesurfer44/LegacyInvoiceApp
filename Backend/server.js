const express = require('express');
const cors = require('cors');
const path = require('path');
const invoiceRoutes = require('./routes/invoices');

const app = express();
console.log(process.env.DATABASE_URL);


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/invoices', invoiceRoutes);

// Serve frontend (optional: if you want backend to also serve your HTML/JS)
app.use(express.static(path.join(__dirname, '../Frontend')));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error', message: err.message });
});

require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});