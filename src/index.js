const db = require('./database/database');
const config = require('./config/config');
const { startBot } = require('./bot/bot');
const { startServer } = require('./web/server');

// Inicializar banco de dados
db.initializeDatabase();
console.log('[GANANCIA] 🗄️  Banco de dados pronto');

// Iniciar bot Discord
startBot();

// Iniciar servidor Express
startServer();

console.log('[GANANCIA] 🚀 Sistema GANÂNCIA iniciado');
