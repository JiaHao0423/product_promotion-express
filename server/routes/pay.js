const express = require('express');
const router = express.Router();
const payController = require('../controllers/payControllers');


router.get('/checkout',payController.checkout)
router.post('/checkout-data',payController.data)
router.get('/checkout-confirmation',payController.confirm)
router.post('/create-order',payController.create)
// router.get('/payment',payController.pay)
router.post('/payment-ECPay',payController.processPayment)
router.get('/order-completion',payController.completion)
router.post('/pay-return',payController.return)

module.exports = router;