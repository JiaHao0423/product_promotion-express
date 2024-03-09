// 連接mysql
const { raw } = require('mysql');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('productpromotion', 'root', '0000', {
    dialect: 'mysql',
    host: 'localhost'
});

//首頁商品列表渲染
exports.view = (req, res) => {
    sequelize.query('SELECT * FROM product')
        .then(([rows, metadata]) => {
            res.render('index', {
                rows1: rows.slice(0, 8),
                rows2: rows.slice(8, 16),
                rows3: rows.slice(16, 24),
                rows4: rows.slice(24, 32),
                rows5: rows.slice(32, 40),
                rows6: rows.slice(40, 48)
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
};


//查詢渲染
exports.find = (req, res) => {
    const searchText = req.body.search;

    sequelize.query('SELECT * FROM product WHERE name LIKE :search', {
        replacements: { search: '%' + searchText + '%' },
        type: sequelize.QueryTypes.SELECT
    })
        .then(data => {
            res.render('search', { data: data });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
};


// 分頁查詢渲染
exports.pagination = (req, res) => {
    let page = req.query.page;
    let limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;
    let title = "";

    switch (page) {
        case "1":
            title = "顯示卡"
            break;
        case "2":
            title = "硬碟"
            break;
        case "3":
            title = "鍵盤/滑鼠"
            break;
        case "4":
            title = "記憶卡"
            break;
        case "5":
            title = "螢幕"
            break;
        default:
            title = "主機"
    }
    sequelize.query('SELECT * FROM product LIMIT :limit OFFSET :offset', {
        replacements: { limit, offset },
        type: sequelize.QueryTypes.SELECT,
        raw: true
    })
        .then(data => {
            res.render('pagination', { data: data, title: title });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
};


//單一產品頁
exports.product = (req, res) => {
    const id = req.params.id;

    sequelize.query('SELECT * FROM product WHERE id LIKE :id', {
        replacements: { id: id },
        type: sequelize.QueryTypes.SELECT
    })
        .then(data => {
            res.render('product', { data: data[0] });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
};