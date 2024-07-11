var { raw } = require('mysql');
var { Sequelize } = require('sequelize');

var { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env
var sequelize = new Sequelize('zeabur', 'root', 'q7sHPXWh6ln8YB2rfVIJa0e159t3pcZ4', {
    dialect: 'mysql',
    host: 'mysql.zeabur.internal',
    port: 3306,
    dialectOptions: {
        connectTimeout: 60000
    },
    pool: {
        max: 15,
        min: 5,
        idle: 20000,
        evict: 15000,
        acquire: 30000
    },
    logging: console.log
});

var UserModle = require('../../models/user');
var User = UserModle(sequelize, Sequelize)
var jwt = require('jsonwebtoken');


// 錯誤處理
var handleErrors = (err) => {

    let errors = { username: '', passhash: '', email: '' };

    if (err.message === '查無此使用者') {
        errors.username = '此帳號尚未註冊'
    }

    if (err.message === '密碼錯誤') {
        errors.passhash = '重新輸入密碼'
    }

    if (err.message === '舊密碼錯誤') {
        errors = { oldPasshash: '' }
        errors.oldPasshash = '舊密碼錯誤請重新輸入'
    }

    // 驗證錯誤並回傳相應訊息
    if (err.message.includes('Validation error')) {
        err.errors.forEach(errorItem => {
            var { path, message } = errorItem;
            errors[path] = message;
        })
    }
    console.log(errors)
    return errors;
}

var maxAge = 3 * 24 * 60 * 60;
var createToken = (id) => {
    return jwt.sign({ id }, 'net shop', {
        expiresIn: maxAge
    });
};

exports.signup_get = (req, res) => {
    res.render('signup')
};

exports.login_get = (req, res) => {
    res.render('login')
};

exports.signup_post = async (req, res) => {
    var { username, passhash, first_name, last_name, phone, email, address } = req.body;

    try {
        var user = await User.create({ username, passhash, first_name, last_name, phone, email, address });
        var userData = await User.findOne({
            where: { username: user.username }
        })
        var token = createToken(userData.id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: userData.id })
    } catch (err) {
        var errors = handleErrors(err)
        res.status(400).json({ errors })
    }
};

exports.login_post = async (req, res) => {
    var { username, passhash } = req.body;
    try {
        var user = await User.login(username, passhash)
        var token = createToken(user.id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user.id });
    } catch (err) {
        var errors = handleErrors(err);
        res.status(400).json(errors);
    }

};

exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    req.session.user = null
    res.redirect('/index');
}

exports.userPage = (req, res) => {
    res.render('userPage');
};

exports.reset_get = (req, res) => {
    res.render('reset');
};

exports.reset_post = (req, res) => {
    var { oldPasshash, newPasshash } = req.body;
    var token = req.cookies.jwt;
    jwt.verify(token, 'net shop', async (err, decodeddToken) => {
        try {

            var check = await User.check(decodeddToken.id, oldPasshash)

            if (check) {
                await User.update({
                    passhash: newPasshash
                }, {
                    where: { id: decodeddToken.id },
                    validate: true,
                    individualHooks: true,
                })
                res.cookie('jwt', '', { maxAge: 1 });
                var token = createToken(decodeddToken.id)
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

                res.status(200).json({});
                res.render('userPage');
            }
        } catch (err) {
            var errors = handleErrors(err);
            res.status(400).json(errors);
        }
    })

}