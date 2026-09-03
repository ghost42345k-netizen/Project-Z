const InventoryModel = require('../../database/models/inventoryModel');

class InventoryController {
  static getAll(req, res) {
    try {
      const items = InventoryModel.getAll();
      res.json({
        success: true,
        data: items,
        totalItems: InventoryModel.getTotalItems(),
        totalQuantity: InventoryModel.getTotalQuantity(),
      });
    } catch (error) {
      console.error('[GANANCIA] Erro ao buscar inventário:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar dados de inventário',
      });
    }
  }

  static getById(req, res) {
    try {
      const { id } = req.params;
      const item = InventoryModel.getById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Item não encontrado',
        });
      }

      res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error('[GANANCIA] Erro ao buscar item:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar item',
      });
    }
  }
}

module.exports = InventoryController;
