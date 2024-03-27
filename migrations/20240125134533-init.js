'use strict';
/** @type {import('sequelize-cli').Migration} */

const { isEmail } = require('validator');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        required: [true, '請輸入使用者名稱'],
        unique: true,
        lowercase: true
      },
      passhash: {
        type: Sequelize.STRING,
        required: [true, '請輸入使用者密碼'],
        minlength: [6, '密碼最小長度為6']
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        required: [true, '請輸入信箱'],
        unique: true,
        lowercase: true,
        validate: [isEmail, '請輸入正確信箱格式']
      },
      address: {
        type: Sequelize.STRING
      }
    });

    await queryInterface.createTable('cart', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.INTEGER
      }
    });

    await queryInterface.createTable('order', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      order_amount: {
        type: Sequelize.INTEGER
      },
      payment_method: {
        type: Sequelize.INTEGER
      },
      invoice_category: {
        type: Sequelize.INTEGER
      },
      invoice_number: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      }
    });

    await queryInterface.createTable('cart_product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cart_id: {
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      }
    });

    await queryInterface.createTable('order_product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      }
    });

    await queryInterface.createTable('payment_log', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      created_at: {
        type: Sequelize.DATE
      },
      payment_method: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      }
    });

    await queryInterface.createTable('product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.INTEGER
      },
      discount: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      sale_price: {
        type: Sequelize.INTEGER
      },
      class: {
        type: Sequelize.STRING
      },
      sale_start: {
        type: Sequelize.DATE
      },
      sale_end: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropAllTables();
  }
};