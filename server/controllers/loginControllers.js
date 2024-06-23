const { raw } = require('mysql');
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
const UserModle = require('../../models/user');
const User = UserModle(sequelize, Sequelize)
const jwt = require('jsonwebtoken');


// 錯誤處理
const handleErrors = (err) => {

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
            const { path, message } = errorItem;
            errors[path] = message;
        })
    }
    console.log(errors)
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
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
    const { username, passhash, first_name, last_name, phone, email, address } = req.body;

    try {
        const user = await User.create({ username, passhash, first_name, last_name, phone, email, address });
        const userData = await User.findOne({
            where: { username: user.username }
        })
        const token = createToken(userData.id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: userData.id })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
};

exports.login_post = async (req, res) => {
    const { username, passhash } = req.body;
    try {
        const user = await User.login(username, passhash)
        const token = createToken(user.id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user.id });
    } catch (err) {
        const errors = handleErrors(err);
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
    const { oldPasshash, newPasshash } = req.body;
    const token = req.cookies.jwt;
    jwt.verify(token, 'net shop', async (err, decodeddToken) => {
        try {

            const check = await User.check(decodeddToken.id, oldPasshash)

            if (check) {
                await User.update({
                    passhash: newPasshash
                }, {
                    where: { id: decodeddToken.id },
                    validate: true,
                    individualHooks: true,
                })
                res.cookie('jwt', '', { maxAge: 1 });
                const token = createToken(decodeddToken.id)
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

                res.status(200).json({});
                res.render('userPage');
            }
        } catch (err) {
            const errors = handleErrors(err);
            res.status(400).json(errors);
        }
    })

}