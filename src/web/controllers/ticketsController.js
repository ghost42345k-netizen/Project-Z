const TicketModel = require('../../database/models/ticketModel');

class TicketsController {
  static getAll(req, res) {
    try {
      const tickets = TicketModel.getAll();
      res.json({
        success: true,
        data: tickets,
        openCount: TicketModel.getOpenTicketsCount(),
      });
    } catch (error) {
      console.error('[GANANCIA] Erro ao buscar tickets:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar dados de tickets',
      });
    }
  }

  static getById(req, res) {
    try {
      const { id } = req.params;
      const ticket = TicketModel.getById(id);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          error: 'Ticket não encontrado',
        });
      }

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      console.error('[GANANCIA] Erro ao buscar ticket:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar ticket',
      });
    }
  }

  static getOpen(req, res) {
    try {
      const tickets = TicketModel.getAll();
      const openTickets = tickets.filter(t => t.status === 'open');

      res.json({
        success: true,
        data: openTickets,
        count: openTickets.length,
      });
    } catch (error) {
      console.error('[GANANCIA] Erro ao buscar tickets abertos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar tickets abertos',
      });
    }
  }
}

module.exports = TicketsController;
