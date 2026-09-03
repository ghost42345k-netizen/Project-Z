require('dotenv').config();

const config = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    ticketCategoryId: process.env.TICKET_CATEGORY_ID,
    staffRoleId: process.env.STAFF_ROLE_ID,
  },
  server: {
    port: process.env.PORT || 3000,
  },
  database: {
    path: process.env.DATABASE_URL || './data.json',
  },
};

// Validação de variáveis críticas
const requiredVars = [
  'DISCORD_TOKEN',
  'CLIENT_ID',
  'GUILD_ID',
  'TICKET_CATEGORY_ID',
  'STAFF_ROLE_ID',
];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`[GANANCIA] ⚠️  Variável obrigatória ausente: ${varName}`);
  }
});

module.exports = config;
