const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers');

router.get('/index',productController.view)
router.post('/search',productController.find)
router.get('/product',productController.pagination)
router.get('/product/:id',productController.product)

module.exports = router;