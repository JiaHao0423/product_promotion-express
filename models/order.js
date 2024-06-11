const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        order_id: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        order_amount: {
            type: DataTypes.INTEGER
        },
        payment_method: {
            type: DataTypes.INTEGER
        },
        invoice_category: {
            type: DataTypes.INTEGER
        },
        invoice_number: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        created_at: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'order',
        timestamps: false
    });

    return Order;
};
