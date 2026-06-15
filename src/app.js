const express = require('express');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const healthRoutes = require('./routes/healthRoutes');
const swaggerRoutes = require('./routes/swaggerRoutes');

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerRoutes);
app.use(authRoutes);
app.use(checkoutRoutes);
app.use(healthRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
