const { Sequelize } = require('sequelize');
const { config } = require('yargs');
const sequelize = new Sequelize('productpromotion', 'root', '0000', {
    dialect: 'mysql',
    host: 'localhost'
});

async function search() {
    // 連接至資料庫
    await sequelize.authenticate();
    // 查詢資料
    const product = await sequelize.query('SELECT * FROM product');
    return product[0]
}

module.exports = search()