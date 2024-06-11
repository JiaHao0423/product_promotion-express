const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Payment_Log = sequelize.define('Payment_Log', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        order_id: {
            type: DataTypes.INTEGER
        },
        created_at: {
            type: DataTypes.DATE
        },
        payment_method: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'payment_log',
        timestamps: false
    });

    return Payment_Log;
};
