const { Sequelize } = require('sequelize');
const { config } = require('yargs');
const sequelize = new Sequelize('zeabur', 'root', 'q7sHPXWh6ln8YB2rfVIJa0e159t3pcZ4', {
    dialect: 'mysql',
    host: 'hkg1.clusters.zeabur.com',
    port: 30395,
    dialectOptions: {
        connectTimeout: 60000 // 以毫秒为单位增加连接超时时间
    },
    pool: {
        max: 10, // 最大連接數
        min: 0, // 最小連接數
        acquire: 30000, // 獲取連接的超時時間（毫秒）
        idle: 10000 // 連接閒置時間（毫秒）超過這個時間連接將被釋放
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