// 連接mysql
var { raw } = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var { Sequelize, where } = require('sequelize');
var sequelize = new Sequelize('productpromotion', 'root', '0000', {
    dialect: 'mysql',
    host: 'localhost'
});


exports.checkout = (req, res) => {

}

exports.order = (req, res) => {

}