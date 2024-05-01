'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Cart_Product = sequelize.define('Cart_Product', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        cart_id: {
            type: DataTypes.INTEGER
        },
        product_id: {
            type: DataTypes.INTEGER
        },
        price: {
            type: DataTypes.INTEGER
        },
        quantity: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'cart_product',
        timestamps: false
    });

    return Cart_Product;
};
