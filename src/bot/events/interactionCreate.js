const { Events, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('../../config/config');
const TicketModel = require('../../database/models/ticketModel');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error('[GANANCIA] ❌ Erro ao executar comando:', error);
        await interaction.reply({
          content: 'Houve um erro ao executar o comando.',
          ephemeral: true,
        });
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId === 'open_ticket') {
        await handleOpenTicket(interaction);
      } else if (interaction.customId === 'close_ticket') {
        await handleCloseTicket(interaction);
      }
    }
  },
};

async function handleOpenTicket(interaction) {
  try {
    const userId = interaction.user.id;
    const guild = interaction.guild;

    // Verificar se já possui ticket aberto
    const openTickets = TicketModel.getOpenByUserId(userId);
    if (openTickets.length > 0) {
      return interaction.reply({
        content: '❌ Você já possui um ticket aberto. Feche-o antes de abrir outro.',
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    // Criar canal privado
    const ticketChannel = await guild.channels.create({
      name: `ticket-${userId.slice(-4)}`,
      type: ChannelType.GuildText,
      parent: config.discord.ticketCategoryId,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: userId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        {
          id: config.discord.staffRoleId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
      ],
    });

    // Registrar no banco
    const ticket = TicketModel.create({
      discord_user_id: userId,
      discord_channel_id: ticketChannel.id,
    });

    // Enviar mensagem inicial no canal
    const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('✅ Ticket Aberto')
      .setDescription(`Olá <@${userId}>!\n\nNosso time de suporte será com você em breve.\n\nDigite sua dúvida ou problema abaixo.`)
      .setFooter({ text: `ID do Ticket: ${ticket.id}` });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('FECHAR TICKET')
        .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({ embeds: [embed], components: [row] });

    await interaction.editReply({
      content: `✅ Ticket criado! Acesse <#${ticketChannel.id}>`,
    });

    console.log(`[GANANCIA] 🎫 Ticket aberto por ${interaction.user.tag} (${ticketChannel.id})`);
  } catch (error) {
    console.error('[GANANCIA] ❌ Erro ao abrir ticket:', error);
    await interaction.editReply({
      content: '❌ Erro ao criar ticket. Tente novamente.',
    });
  }
}

async function handleCloseTicket(interaction) {
  try {
    const channel = interaction.channel;
    const ticket = TicketModel.getByChannelId(channel.id);

    if (!ticket) {
      return interaction.reply({
        content: '❌ Ticket não encontrado no sistema.',
        ephemeral: true,
      });
    }

    // Verificar permissões
    const staffRole = interaction.guild.roles.cache.get(config.discord.staffRoleId);
    const isStaff = interaction.member.roles.cache.has(config.discord.staffRoleId);
    const isOwner = ticket.discord_user_id === interaction.user.id;

    if (!isStaff && !isOwner) {
      return interaction.reply({
        content: '❌ Você não tem permissão para fechar este ticket.',
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: '⏳ Fechando ticket...',
    });

    // Atualizar banco
    TicketModel.close(ticket.id);

    // Aguardar um pouco antes de deletar
    setTimeout(async () => {
      await channel.delete().catch(err => {
        console.error('[GANANCIA] Erro ao deletar canal:', err);
      });
      console.log(`[GANANCIA] 🎫 Ticket fechado: ${ticket.id}`);
    }, 2000);
  } catch (error) {
    console.error('[GANANCIA] ❌ Erro ao fechar ticket:', error);
    await interaction.reply({
      content: '❌ Erro ao fechar ticket.',
      ephemeral: true,
    });
  }
}
