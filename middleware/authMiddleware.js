const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('productpromotion', 'root', '0000', {
    dialect: 'mysql',
    host: 'localhost'
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
