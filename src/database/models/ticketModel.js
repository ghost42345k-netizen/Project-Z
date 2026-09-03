const db = require('../database');

class TicketModel {
  static getAll() {
    const data = db.readDatabase();
    return data ? data.tickets || [] : [];
  }

  static getById(id) {
    const tickets = this.getAll();
    return tickets.find(ticket => ticket.id === parseInt(id));
  }

  static getByChannelId(channelId) {
    const tickets = this.getAll();
    return tickets.find(ticket => ticket.discord_channel_id === channelId);
  }

  static getByUserId(userId) {
    const tickets = this.getAll();
    return tickets.filter(ticket => ticket.discord_user_id === userId);
  }

  static getOpenByUserId(userId) {
    const userTickets = this.getByUserId(userId);
    return userTickets.filter(ticket => ticket.status === 'open');
  }

  static create(ticketData) {
    const data = db.readDatabase();
    if (!data) return null;

    const newTicket = {
      id: Math.max(...data.tickets.map(t => t.id || 0), 0) + 1,
      discord_user_id: ticketData.discord_user_id,
      discord_channel_id: ticketData.discord_channel_id,
      status: 'open',
      created_at: new Date().toISOString(),
    };

    data.tickets.push(newTicket);
    db.writeDatabase(data);
    return newTicket;
  }

  static update(id, ticketData) {
    const data = db.readDatabase();
    if (!data) return null;

    const ticket = data.tickets.find(t => t.id === parseInt(id));
    if (!ticket) return null;

    Object.assign(ticket, ticketData);
    db.writeDatabase(data);
    return ticket;
  }

  static close(id) {
    return this.update(id, { status: 'closed' });
  }

  static delete(id) {
    const data = db.readDatabase();
    if (!data) return false;

    const index = data.tickets.findIndex(t => t.id === parseInt(id));
    if (index === -1) return false;

    data.tickets.splice(index, 1);
    db.writeDatabase(data);
    return true;
  }

  static getOpenTicketsCount() {
    const tickets = this.getAll();
    return tickets.filter(ticket => ticket.status === 'open').length;
  }
}

module.exports = TicketModel;
