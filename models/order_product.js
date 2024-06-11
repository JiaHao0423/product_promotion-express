const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Order_Product = sequelize.define('Order_Product', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        order_id: {
            type: DataTypes.STRING
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
        tableName: 'order_product',
        timestamps: false
    });

    return Order_Product;
};
