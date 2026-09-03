const express = require('express');
const path = require('path');
const config = require('../config/config');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// API Routes
app.use('/api', apiRoutes);

// Serve pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.get('/stock', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/stock.html'));
});

app.get('/inventory', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/inventory.html'));
});

app.get('/tickets', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/tickets.html'));
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Página não encontrada',
  });
});

// Iniciar servidor
function startServer() {
  const PORT = config.server.port;
  app.listen(PORT, () => {
    console.log(`[GANANCIA] 🌐 Servidor web iniciado em http://localhost:${PORT}`);
  });
}

module.exports = { app, startServer };
