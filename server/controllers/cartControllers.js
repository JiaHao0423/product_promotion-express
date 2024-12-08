// 匯入必要的模組

const { raw } = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Sequelize, where } = require('sequelize');


// 環境變數解構賦值
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env
console.log(DB_NAME);


// 驗證環境變數是否完整
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
    throw new Error("環境變數缺少必須的資料庫配置！");
}
// 初始化 Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
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

// 匯入資料模型
const CartModel = require('../../models/cart');
const CartProductModel = require('../../models/cart_product');
const ProductModel = require('../../models/product');
const OrderModel = require('../../models/order');
// 初始化模型
const Cart = CartModel(sequelize, Sequelize)
const CartProduct = CartProductModel(sequelize, Sequelize)
const Product = ProductModel(sequelize, Sequelize)
const Order = OrderModel(sequelize, Sequelize)

const { product } = require('./productControllers');
const { patch } = require('../routes/product');
Cart.hasMany(CartProduct, {
    foreignKey: 'cart_id'
});
Product.hasMany(CartProduct, {
    foreignKey: 'product_id'
});



async function updateData(userid, id, quantity, sale_price) {
    const cart = await Cart.findOne({ where: { user_id: userid } })
    if (!cart) {
        cart = await Cart.create({ user_id: userid })
    }
    let cart_product = await CartProduct.findOne({ where: { cart_id: cart.id, product_id: id } })
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
    const cart = await Cart.findOne({ where: { user_id: userid } })
    const cart_product = await CartProduct.findOne({ where: { cart_id: cart.id, product_id: id } })
    if (cart_product) {
        await cart_product.destroy();
    } else {
        console.log("無法找到要刪除的資料。");
    }
}

async function updateSession(req, userid) {
    const cart = await Cart.findOne({ where: { user_id: userid } })
    if (!cart) {
        cart = await Cart.create({ user_id: userid })
    }
    const cartData = await Cart.findOne({ where: { user_id: userid }, include: [CartProduct] });
    const cartProductData = JSON.parse(JSON.stringify(cartData.Cart_Products, null, 4))

    const MyCart = []
    const products = await Product.findAll();
    const data = JSON.parse(JSON.stringify(products, null, 4))

    try {
        cartProductData.forEach(element => {
            const product_id = element.product_id
            const productDetail = data.find(item => item.id === product_id)
            const classname = productDetail.class
            const name = productDetail.name
            const price = productDetail.sale_price
            const quantity = element.quantity
            const product = { id: product_id, classname: classname, name: name, sale_price: price, price: price * quantity, quantity: quantity }
            MyCart.push(product)
        });
        req.session.cart = MyCart;
    } catch (err) {
        console.error('读取错误：', err);
        throw err;
    }
}

exports.add = async (req, res) => {
    const id = req.body.id;
    const classname = req.body.classname;
    const name = req.body.name;
    const price = req.body.price;
    const sale_price = req.body.sale_price;
    const quantity = req.body.quantity;
    const image = req.body.image;
    const product = { id: id, classname: classname, name: name, price: price, sale_price: sale_price, quantity: quantity, image: image }

    if (!req.session.user) {
        res.redirect('/login')
    } else {
        let userid = req.session.user.id;
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
    } else {
        let userid = req.session.user.id;
        try {
            await updateSession(req, userid)
            let cart = req.session.cart
            res.render('cart', { cart: cart })
        } catch (err) {
            console.error('會話更新錯誤', err);
            throw err;
        }
    }
}

exports.remove = async (req, res) => {
    const id = req.body.id;
    const userid = req.session.user.id;

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
    const id = req.body.id;
    const userid = req.session.user.id;

    const increase = req.body.increase
    const decrease = req.body.decrease;
    const product = await Product.findOne({ where: { id: id } })
    const sale_price = product.sale_price

    if (increase) {
        try {
            const quantity = 1
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
            const quantity = -1
            await updateData(userid, id, quantity, sale_price)
            await updateSession(req, userid, id)
            res.redirect('/cart')
        } catch (err) {
            console.error('數量修改錯誤', err);
            throw err;
        }
    }

}