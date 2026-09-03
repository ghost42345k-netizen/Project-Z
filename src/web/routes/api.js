const express = require('express');
const router = express.Router();

const StockController = require('../controllers/stockController');
const InventoryController = require('../controllers/inventoryController');
const TicketsController = require('../controllers/ticketsController');

// Stock Routes
router.get('/stock', StockController.getAll);
router.get('/stock/:id', StockController.getById);

// Inventory Routes
router.get('/inventory', InventoryController.getAll);
router.get('/inventory/:id', InventoryController.getById);

// Tickets Routes
router.get('/tickets', TicketsController.getAll);
router.get('/tickets/:id', TicketsController.getById);
router.get('/tickets-open', TicketsController.getOpen);

module.exports = router;
