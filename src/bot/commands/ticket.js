const { SlashCommandBuilder } = require('discord.js');
const TicketModel = require('../../database/models/ticketModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Gerencia tickets de suporte')
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Mostra o status dos tickets')
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'status') {
      const tickets = TicketModel.getAll();
      const open = tickets.filter(t => t.status === 'open').length;
      const closed = tickets.filter(t => t.status === 'closed').length;

      await interaction.reply({
        content: `📊 **Status dos Tickets**\n\n✅ Abertos: ${open}\n❌ Fechados: ${closed}\n📈 Total: ${tickets.length}`,
        ephemeral: true,
      });
    }
  },
};
