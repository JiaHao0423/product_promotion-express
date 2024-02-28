'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
  }
  User.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING
      },
      passhash: {
        type: DataTypes.STRING
      },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.STRING
      }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });
  return User;
};