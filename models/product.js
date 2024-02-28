'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    
  }
  Product.init({
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
    sequelize,
    modelName: 'Product',
    tableName: 'product',
    timestamps: false
  });
  return Product;
};