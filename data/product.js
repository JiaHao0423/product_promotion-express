const { Sequelize } = require('sequelize');
const { config } = require('yargs');
const sequelize = new Sequelize('zeabur', 'root', 'q7sHPXWh6ln8YB2rfVIJa0e159t3pcZ4', {
    dialect: 'mysql',
    host: 'hkg1.clusters.zeabur.com',
    port: 30395
});

async function search() {
    // 連接至資料庫
    await sequelize.authenticate();
    // 查詢資料
    const product = await sequelize.query('SELECT * FROM product');
    return product[0]
}

module.exports = search()