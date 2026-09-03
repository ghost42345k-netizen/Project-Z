const db = require('../database');

class InventoryModel {
  static getAll() {
    const data = db.readDatabase();
    return data ? data.inventory || [] : [];
  }

  static getById(id) {
    const items = this.getAll();
    return items.find(item => item.id === parseInt(id));
  }

  static create(itemData) {
    const data = db.readDatabase();
    if (!data) return null;

    const newItem = {
      id: Math.max(...data.inventory.map(i => i.id), 0) + 1,
      name: itemData.name,
      image: itemData.image || '/assets/images/default.png',
      quantity: itemData.quantity || 0,
      description: itemData.description || '',
      status: itemData.status || 'available',
    };

    data.inventory.push(newItem);
    db.writeDatabase(data);
    return newItem;
  }

  static update(id, itemData) {
    const data = db.readDatabase();
    if (!data) return null;

    const item = data.inventory.find(i => i.id === parseInt(id));
    if (!item) return null;

    Object.assign(item, itemData);
    db.writeDatabase(data);
    return item;
  }

  static delete(id) {
    const data = db.readDatabase();
    if (!data) return false;

    const index = data.inventory.findIndex(i => i.id === parseInt(id));
    if (index === -1) return false;

    data.inventory.splice(index, 1);
    db.writeDatabase(data);
    return true;
  }

  static getTotalItems() {
    const items = this.getAll();
    return items.length;
  }

  static getTotalQuantity() {
    const items = this.getAll();
    return items.reduce((total, item) => total + item.quantity, 0);
  }
}

module.exports = InventoryModel;
