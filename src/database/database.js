const fs = require('fs');
const path = require('path');
const config = require('../config/config');

const dbPath = config.database.path;

// Inicializar banco com estrutura padrão
function initializeDatabase() {
  if (!fs.existsSync(dbPath)) {
    const defaultData = {
      coins: [
        {
          id: 1,
          name: 'Gold',
          image: '/assets/images/gold.png',
          amount: 12500,
          status: 'available',
        },
        {
          id: 2,
          name: 'Diamond',
          image: '/assets/images/diamond.png',
          amount: 500,
          status: 'available',
        },
      ],
      inventory: [
        {
          id: 1,
          name: 'Poção de Vida',
          image: '/assets/images/potion.png',
          quantity: 250,
          description: 'Restaura 50 de vida',
          status: 'available',
        },
        {
          id: 2,
          name: 'Escudo Épico',
          image: '/assets/images/shield.png',
          quantity: 15,
          description: 'Aumenta defesa em 25%',
          status: 'available',
        },
        {
          id: 3,
          name: 'Chave do Tesouro',
          image: '/assets/images/key.png',
          quantity: 3,
          description: 'Abre baús especiais',
          status: 'available',
        },
      ],
      tickets: [],
    };

    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
    console.log('[GANANCIA] ✅ Banco de dados inicializado');
  }
}

// Ler dados do banco
function readDatabase() {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[GANANCIA] ❌ Erro ao ler banco:', error);
    return null;
  }
}

// Escrever dados no banco
function writeDatabase(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('[GANANCIA] ❌ Erro ao escrever banco:', error);
    return false;
  }
}

module.exports = {
  initializeDatabase,
  readDatabase,
  writeDatabase,
};
