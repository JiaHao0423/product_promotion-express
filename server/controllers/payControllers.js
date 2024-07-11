var { raw } = require('mysql');
var bodyParser = require('body-parser');
var { Sequelize, where } = require('sequelize');
var session = require('express-session');


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



// var { pay } = require('./payControllers');
// var { product } = require('./productControllers');
var ecpay_payment = require('ecpay_aio_nodejs');
var OrderModel = require('../../models/order');
var Order = OrderModel(sequelize, Sequelize)
var OrderProductModel = require('../../models/order_product');
var OrderProduct = OrderProductModel(sequelize, Sequelize)
var ProductModel = require('../../models/product');
var Product = ProductModel(sequelize, Sequelize)

var { MERCHANTID, HASHKEY, HASHIV, HOST } = process.env
var options = {
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
    var cart = req.session.cart
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
    var name = req.body.name
    var address = req.body.address
    var number = req.body.number
    var pay = req.body.pay
    var bill = req.body.bill
    var bill_number = req.body.bill_number
    var now = new Date();
    var date = now.getFullYear() + '/' +
        ('0' + (now.getMonth() + 1)).slice(-2) + '/' +
        ('0' + now.getDate()).slice(-2) + ' ' +
        ('0' + now.getHours()).slice(-2) + ':' +
        ('0' + now.getMinutes()).slice(-2) + ':' +
        ('0' + now.getSeconds()).slice(-2);

    var data = {
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
    var now = new Date();
    var orderData = {
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
    var order = await Order.findOne({ where: { order_id: orderData.order_id } })
    if (!order) {
        order = await Order.create(orderData)
    }

    var order_amount = 0
    var cart = req.session.cart

    for (var cartItem of cart) {
        var orderProduct = await OrderProduct.findOne({ where: { order_id: orderData.order_id, product_id: cartItem.id } })
        if (!orderProduct) {
            var data = {
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
    var orderAmounr = order.order_amount
    res.render('payment', { order_amount: orderAmounr });
};


exports.processPayment = async (req, res) => {
    var crypto = require('crypto');
    var userid = req.session.user.id
    var order = await Order.findOne({ where: { user_id: userid } })
    var orderAmounr = order.order_amount
    var orderProduct = await OrderProduct.findAll({ where: { order_id: order.order_id } })
    var product_items = []

    await Promise.all(orderProduct.map(async data => {
        var productData = await Product.findOne({
            where: { id: data.product_id },
            raw: true
        })
        product_items.push(productData.name + "*" + data.quantity)
    }))

    var product_item = product_items.join("#")


    

    var uniqueid = order.order_id + crypto.randomBytes(4).toString('hex');

    var base_param = {
        MerchantTradeNo: uniqueid, // 獨一無二的商家訂單編號
        MerchantTradeDate: req.session.data.created_at, // 交易時間
        TotalAmount: orderAmounr.toString(), // 交易金額
        TradeDesc: 'Test Transaction', // 交易描述
        ItemName: product_item, // 商品名稱
        ReturnURL: HOST + '/pay-return',
        ClientBackURL: HOST + '/order-completion',
        NeedExtraPaidInfo: 'N' // 額外付款資訊
    };
    var create = new ecpay_payment(options);
    // var html = create.payment_client.aio_check_out_credit_onetime(base_param);
    const html = create.payment_client.aio_check_out_all(base_param);
    res.render('ECpay', { html: html })

};
exports.return = (req, res) => {
    console.log('req.body:', req.body);

    const { CheckMacValue } = req.body;
    const data = { ...req.body };
    delete data.CheckMacValue; // 此段不驗證

    const create = new ecpay_payment(options);
    const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

    console.log(
        '確認交易正確性：',
        CheckMacValue === checkValue,
        CheckMacValue,
        checkValue,
    );

    // 交易成功後，需要回傳 1|OK 給綠界
    res.send('1|OK');
};

exports.completion = (req, res) => {
    res.render('order-completion');
};