const { Events } = require('discord.js');
const config = require('../../config/config');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`[GANANCIA] ✅ Bot conectado como ${client.user.tag}`);

    // Registrar comandos slash
    const guild = client.guilds.cache.get(config.discord.guildId);
    if (!guild) {
      console.error('[GANANCIA] ❌ Guild não encontrada');
      return;
    }

    const commands = client.commands.map(cmd => cmd.data);
    guild.commands.set(commands).then(() => {
      console.log('[GANANCIA] ✅ Comandos slash registrados');
    });

    // Enviar painel de tickets
    sendTicketPanel(client);
  },
};

async function sendTicketPanel(client) {
  try {
    const guild = client.guilds.cache.get(config.discord.guildId);
    const channel = guild.channels.cache.find(
      c => c.name === 'tickets' || c.id === config.discord.ticketCategoryId
    );

    if (!channel || !channel.isTextBased()) {
      console.warn('[GANANCIA] ⚠️  Canal de tickets não encontrado');
      return;
    }

    // Verificar se a mensagem já existe
    const messages = await channel.messages.fetch({ limit: 10 });
    const existingPanel = messages.find(m => m.content.includes('CENTRAL DE ATENDIMENTO'));

    if (existingPanel) {
      console.log('[GANANCIA] ℹ️  Painel de tickets já existe');
      return;
    }

    const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('╔══════════════════════════════╗\n        GANÂNCIA\n     CENTRAL DE ATENDIMENTO\n╚══════════════════════════════╝')
      .setDescription('Precisa de atendimento?\n\nAbra um ticket para falar com nossa equipe.')
      .setFooter({ text: 'Sistema de Tickets • Ganância' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('ABRIR TICKET')
        .setStyle(ButtonStyle.Success)
    );

    await channel.send({ embeds: [embed], components: [row] });
    console.log('[GANANCIA] ✅ Painel de tickets enviado');
  } catch (error) {
    console.error('[GANANCIA] ❌ Erro ao enviar painel:', error);
  }
}
