const express = require('express');
const router = express.Router();
const cartController = require('../controllers/payControllers');


router.get('/checkout',cartController.checkout)
router.post('/checkout-data',cartController.data)
router.get('/checkout-confirmation',cartController.confirm)
router.post('/create-order',cartController.create)
// router.get('/payment',cartController.pay)
router.post('/payment-ECPay',cartController.processPayment)
router.post('/order-completion',cartController.completion)
router.post('/pay-return',cartController.return)

module.exports = router;