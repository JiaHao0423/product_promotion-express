const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartControllers');

router.post('/addToCart',cartController.add)
router.get('/cart',cartController.view)
router.post('/remove_product',cartController.remove)
router.post('/edit_product_quantity',cartController.edit)

module.exports = router;