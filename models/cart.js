'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        image: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'cart',
        timestamps: false
    });


    return Cart;
};
