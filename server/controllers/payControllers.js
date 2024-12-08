let { raw } = require('mysql');
let bodyParser = require('body-parser');
let { Sequelize, where } = require('sequelize');
let session = require('express-session');


let { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env
let sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
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



// let { pay } = require('./payControllers');
// let { product } = require('./productControllers');
let ecpay_payment = require('ecpay_aio_nodejs');
let OrderModel = require('../../models/order');
let Order = OrderModel(sequelize, Sequelize)
let OrderProductModel = require('../../models/order_product');
let OrderProduct = OrderProductModel(sequelize, Sequelize)
let ProductModel = require('../../models/product');
let Product = ProductModel(sequelize, Sequelize)

let { MERCHANTID, HASHKEY, HASHIV, HOST } = process.env
let options = {
    OperationMode: 'Test',
    MercProfile: {
        MerchantID: MERCHANTID,
        HashKey: HASHKEY,
        HashIV: HASHIV
    },
    IgnorePayment: {

    },
    IsProjectContractor: false
}

exports.checkout = (req, res) => {
    let cart = req.session.cart
    if (cart) {
        res.render('checkout');
    } else {
        res.redirect('/cart');
    }

};

exports.confirm = (req, res) => {
    res.render('checkout-confirmation');
};

exports.pay = (req, res) => {
    res.render('payment');
};


exports.data = (req, res) => {
    let name = req.body.name
    let address = req.body.address
    let number = req.body.number
    let pay = req.body.pay
    let bill = req.body.bill
    let bill_number = req.body.bill_number
    let now = new Date();
    let date = now.getFullYear() + '/' +
        ('0' + (now.getMonth() + 1)).slice(-2) + '/' +
        ('0' + now.getDate()).slice(-2) + ' ' +
        ('0' + now.getHours()).slice(-2) + ':' +
        ('0' + now.getMinutes()).slice(-2) + ':' +
        ('0' + now.getSeconds()).slice(-2);

    let data = {
        name: name,
        address: address,
        number: number,
        pay: pay,
        bill: bill,
        bill_number: bill_number,
        created_at: date
    }
    req.session.data = data;
    res.render('checkout-confirmation', { data: data })
};


exports.create = async (req, res) => {
    let now = new Date();
    let orderData = {
        order_id: "TE" + now.toISOString().slice(0, 10).replace(/-/g, ''),
        user_id: req.session.user.id,
        order_amount: 0,
        payment_method: req.session.data.pay,
        invoice_category: req.session.data.bill,
        invoice_number: req.session.data.bill_number,
        address: req.session.data.address,
        created_at: req.session.data.created_at,
        status: "未結帳"
    }
    let order = await Order.findOne({ where: { order_id: orderData.order_id } })
    if (!order) {
        order = await Order.create(orderData)
    }

    let order_amount = 0
    let cart = req.session.cart

    for (let cartItem of cart) {
        let orderProduct = await OrderProduct.findOne({ where: { order_id: orderData.order_id, product_id: cartItem.id } })
        if (!orderProduct) {
            let data = {
                order_id: orderData.order_id,
                product_id: cartItem.id,
                price: cartItem.price,
                quantity: cartItem.quantity
            }
            orderProduct = await OrderProduct.create(data)
        }
        order_amount += cartItem.price * cartItem.quantity
    }

    order.order_amount = order_amount
    await order.save()
    let orderAmounr = order.order_amount
    res.render('payment', { order_amount: orderAmounr });
};


exports.processPayment = async (req, res) => {
    let crypto = require('crypto');
    let userid = req.session.user.id
    let order = await Order.findOne({ where: { user_id: userid } })
    let orderAmounr = order.order_amount
    let orderProduct = await OrderProduct.findAll({ where: { order_id: order.order_id } })
    let product_items = []

    await Promise.all(orderProduct.map(async data => {
        let productData = await Product.findOne({
            where: { id: data.product_id },
            raw: true
        })
        product_items.push(productData.name + "*" + data.quantity)
    }))

    let product_item = product_items.join("#")




    let uniqueid = order.order_id + crypto.randomBytes(4).toString('hex');

    session.order_details = {
        orderNO: uniqueid,
        orderAmounr: orderAmounr.toString(),
        orderDate: req.session.data.created_at
    }

    let base_param = {
        MerchantTradeNo: uniqueid, // 獨一無二的商家訂單編號
        MerchantTradeDate: req.session.data.created_at, // 交易時間
        TotalAmount: orderAmounr.toString(), // 交易金額
        TradeDesc: 'Test Transaction', // 交易描述
        ItemName: product_item, // 商品名稱
        ReturnURL: `${HOST}/pay-return`,
        ClientBackURL: `${HOST}/order-completion`
    };
    let create = new ecpay_payment(options);
    let html = create.payment_client.aio_check_out_credit_onetime(base_param);
    console.log(html);

    res.render('ECpay', { html: html })

};
exports.return = (req, res) => {
    let { CheckMacValue } = req.body;
    let data = { ...req.body };
    delete data.CheckMacValue;

    let create = new ecpay_payment(options);
    let checkValue = create.payment_client.helper.gen_chk_mac_value(data);

    // 交易成功後，需要回傳 1|OK 給綠界
    res.send('1|OK');
};

exports.completion = (req, res) => {
    res.render('order-completion', { date: session.order_details });
};