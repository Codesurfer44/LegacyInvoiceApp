const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const invoiceRoutes = require('./routes/invoiceRoutes');
const errorHandler = require('./utils/errorHandler');
const searchEngineRoutes = require('./routes/searchEngine');


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/searchEngine', searchEngineRoutes);

app.use('/api/invoices', invoiceRoutes);

app.get('/', (req, res) => {
  res.send('Invoice API is running');
});

app.use(errorHandler);

module.exports = app;
