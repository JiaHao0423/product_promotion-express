const { Sequelize } = require('sequelize');
const { config } = require('yargs');
let { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: 'mysql',
    host: DB_HOST,
    port: DB_PORT,
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