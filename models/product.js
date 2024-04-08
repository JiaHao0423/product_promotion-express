'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.INTEGER
    },
    discount: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.INTEGER
    },
    sale_price: {
      type: DataTypes.INTEGER
    },
    class: {
      type: DataTypes.STRING
    },
    sale_start: {
      type: DataTypes.DATE
    },
    sale_end: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'product',
    timestamps: false
  })

  return Product;
};
