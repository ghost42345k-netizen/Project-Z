const db = require('../database');

class CoinModel {
  static getAll() {
    const data = db.readDatabase();
    return data ? data.coins || [] : [];
  }

  static getById(id) {
    const coins = this.getAll();
    return coins.find(coin => coin.id === parseInt(id));
  }

  static create(coinData) {
    const data = db.readDatabase();
    if (!data) return null;

    const newCoin = {
      id: Math.max(...data.coins.map(c => c.id), 0) + 1,
      name: coinData.name,
      image: coinData.image || '/assets/images/default.png',
      amount: coinData.amount || 0,
      status: coinData.status || 'available',
    };

    data.coins.push(newCoin);
    db.writeDatabase(data);
    return newCoin;
  }

  static update(id, coinData) {
    const data = db.readDatabase();
    if (!data) return null;

    const coin = data.coins.find(c => c.id === parseInt(id));
    if (!coin) return null;

    Object.assign(coin, coinData);
    db.writeDatabase(data);
    return coin;
  }

  static delete(id) {
    const data = db.readDatabase();
    if (!data) return false;

    const index = data.coins.findIndex(c => c.id === parseInt(id));
    if (index === -1) return false;

    data.coins.splice(index, 1);
    db.writeDatabase(data);
    return true;
  }

  static getTotalCoins() {
    const coins = this.getAll();
    return coins.reduce((total, coin) => total + coin.amount, 0);
  }
}

module.exports = CoinModel;
