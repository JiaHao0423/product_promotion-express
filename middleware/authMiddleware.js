const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
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
const UserModle = require('../models/user');
const User = UserModle(sequelize, Sequelize)

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // 檢查是否有JWT
    if (token) {
        jwt.verify(token, 'net shop', (err, decodeddToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login')
            } else {
                console.log(decodeddToken)
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'net shop', async (err, decodeddToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findOne({ where: { id: decodeddToken.id } });
                res.locals.user = user.dataValues;
                req.session.user = user.dataValues;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser }
