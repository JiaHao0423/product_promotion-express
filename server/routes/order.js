const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControllers');

router.get('/checkout',cartController.checkout)
router.post('/place_order',cartController.order)

module.exports = router;