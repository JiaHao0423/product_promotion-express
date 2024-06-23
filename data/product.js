const { Sequelize } = require('sequelize');
const { config } = require('yargs');
const sequelize = new Sequelize('zeabur', 'root', 'q7sHPXWh6ln8YB2rfVIJa0e159t3pcZ4', {
    dialect: 'mysql',
    host: 'mysql.zeabur.internal',
    port: 3306,
    dialectOptions: {
        connectTimeout: 60000 // 以毫秒为单位增加连接超时时间
    },
    pool: {
        max: 15,
        min: 5,
        idle: 20000,
        evict: 15000,
        acquire: 30000
    }
});

async function search() {
    // 連接至資料庫
    await sequelize.authenticate();
    // 查詢資料
    const product = await sequelize.query('SELECT * FROM product');
    return product[0]
}

module.exports = search()