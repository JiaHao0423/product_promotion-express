const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginControllers');
const { route } = require('./product');

router.get('/signup',loginController.signup_get);
router.post('/signup',loginController.signup_post);
router.get('/login',loginController.login_get);
router.post('/login',loginController.login_post);
router.get('/logout',loginController.logout_get);
router.get('/userPage',loginController.userPage);
router.get('/reset',loginController.reset_get);
router.post('/reset',loginController.reset_post);

module.exports = router;