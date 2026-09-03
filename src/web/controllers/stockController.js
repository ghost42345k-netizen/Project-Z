const CoinModel = require('../../database/models/coinModel');

class StockController {
  static getAll(req, res) {
    try {
      const coins = CoinModel.getAll();
      res.json({
        success: true,
        data: coins,
        total: CoinModel.getTotalCoins(),
      });
    } catch (error) {
      console.error('[GANANCIA] Erro ao buscar stock:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar dados de stock',
      });
    }
  }

  static getById(req, res) {
    try {
      const { id } = req.params;
      const coin = CoinModel.getById(id);

      if (!coin) {
        return res.status(404).json({
          success: false,
          error: 'Moeda não encontrada',
        });
      }

      res.json({
        success: true,
        data: coin,
      });
    } catch (error) {
      console.error('[GANANCIA] Erro ao buscar moeda:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar moeda',
      });
    }
  }
}

module.exports = StockController;
