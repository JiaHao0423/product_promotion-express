// 連接mysql
var { raw } = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var { Sequelize, where } = require('sequelize');

var { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env
var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: 'mysql',
    host: DB_HOST,
    port: DB_PORT,
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
var CartModel = require('../../models/cart');
var Cart = CartModel(sequelize, Sequelize)
var CartProductModel = require('../../models/cart_product');
var CartProduct = CartProductModel(sequelize, Sequelize)
var ProductModel = require('../../models/product');
var Product = ProductModel(sequelize, Sequelize)
var { product } = require('./productControllers');
var OrderModel = require('../../models/order');
var Order = OrderModel(sequelize, Sequelize)
Cart.hasMany(CartProduct, {
    foreignKey: 'cart_id'
});
Product.hasMany(CartProduct, {
    foreignKey: 'product_id'
});


async function updateData(userid, id, quantity, sale_price) {
    var cart = await Cart.findOne({ where: { user_id: userid } })
    if (!cart) {
        cart = await Cart.create({ user_id: userid })
    }
    var cart_product = await CartProduct.findOne({ where: { cart_id: cart.id, product_id: id } })
    if (cart_product) {
        cart_product.quantity = parseInt(cart_product.quantity) + parseInt(quantity)
        if (cart_product.quantity > 0) {
            cart_product.price = cart_product.quantity * sale_price
            await cart_product.save();
        } else {
            await cart_product.destroy();
        }
    } else {
        cart_product = await CartProduct.create({ cart_id: cart.id, product_id: id, price: sale_price * parseInt(quantity), quantity: parseInt(quantity) })
    }
}

async function removeData(userid, id) {
    var cart = await Cart.findOne({ where: { user_id: userid } })
    var cart_product = await CartProduct.findOne({ where: { cart_id: cart.id, product_id: id } })
    if (cart_product) {
        await cart_product.destroy();
    } else {
        console.log("無法找到要刪除的資料。");
    }
}

async function updateSession(req, userid) {
    var cart = await Cart.findOne({ where: { user_id: userid } })
    if (!cart) {
        cart = await Cart.create({ user_id: userid })
    }
    var cartData = await Cart.findOne({ where: { user_id: userid }, include: [CartProduct] });
    var cartProductData = JSON.parse(JSON.stringify(cartData.Cart_Products, null, 4))

    var cart = []
    var products = await Product.findAll();
    var data = JSON.parse(JSON.stringify(products, null, 4))

    try {
        cartProductData.forEach(element => {
            var product_id = element.product_id
            var productDetail = data.find(item => item.id === product_id)
            var classname = productDetail.class
            var name = productDetail.name
            var price = productDetail.sale_price
            var quantity = element.quantity
            var product = { id: product_id, classname: classname, name: name, sale_price: price, price: price * quantity, quantity: quantity }
            cart.push(product)
        });
        req.session.cart = cart;
    } catch (err) {
        console.error('读取错误：', err);
        throw err;
    }
}

exports.add = async (req, res) => {
    var id = req.body.id;
    var classname = req.body.classname;
    var name = req.body.name;
    var price = req.body.price;
    var sale_price = req.body.sale_price;
    var quantity = req.body.quantity;
    var image = req.body.image;
    var product = { id: id, classname: classname, name: name, price: price, sale_price: sale_price, quantity: quantity, image: image }

    if (!req.session.user) {
        res.redirect('/login')
    } else {
        var userid = req.session.user.id;
        try {
            await updateData(userid, id, quantity, sale_price)
            if (!req.session.cart) {
                req.session.cart = [];
            }

            await updateSession(req, userid, id)

            res.redirect('/cart')

        } catch (err) {
            console.error('會話更新錯誤', err);
            throw err;
        }
    }
};


exports.view = async (req, res) => {
    
    if (!req.session.user) {
        res.redirect('/login')
    }else {
        var userid = req.session.user.id;
        try {
            await updateSession(req, userid)
            var cart = req.session.cart
            res.render('cart', { cart: cart })
        } catch (err) {
            console.error('會話更新錯誤', err);
            throw err;
        }
    }
}

exports.remove = async (req, res) => {
    var id = req.body.id;
    var userid = req.session.user.id;

    try {
        await removeData(userid, id)

        await updateSession(req, userid)

        res.redirect('/cart')

    } catch (err) {
        console.error('數據刪除錯誤', err);
        throw err;
    }
}

exports.edit = async (req, res) => {
    var id = req.body.id;
    var userid = req.session.user.id;

    var increase = req.body.increase
    var decrease = req.body.decrease;
    var product = await Product.findOne({ where: { id: id } })
    var sale_price = product.sale_price

    if (increase) {
        try {
            var quantity = 1
            await updateData(userid, id, quantity, sale_price)
            await updateSession(req, userid, id)
            res.redirect('/cart')

        } catch (err) {
            console.error('數量修改錯誤', err);
            throw err;
        }

    }

    if (decrease) {
        try {
            var quantity = -1
            await updateData(userid, id, quantity, sale_price)
            await updateSession(req, userid, id)
            res.redirect('/cart')
        } catch (err) {
            console.error('數量修改錯誤', err);
            throw err;
        }
    }

}