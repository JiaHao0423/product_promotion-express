"use strict";
const { DataTypes, Model } = require("sequelize");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING,
        required: [true, "請輸入使用者名稱"],
        unique: {
          value: true,
          msg: "該使用者名稱已被使用",
        },
        lowercase: true,
      },
      passhash: {
        type: DataTypes.STRING,
        required: [true, "請輸入使用者密碼"],
        validate: {
          len: {
            args: [6],
            msg: "密碼長度必須大於6",
          },
        },
      },
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        unique: {
          value: true,
          msg: "該信箱已被使用",
        },
        lowercase: true,
        validate: {
          isEmail: { msg: "請輸入正確信箱格式" },
        },
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
  // 保存前事件處理
  // User.beforeCreate(async (user, options) => {
  //   console.log("使用者即將創建", user.toJSON());
  //   // 密碼hash處理
  //   const salt = await bcrypt.genSalt(10);
  //   user.passhash = await bcrypt.hash(user.passhash, salt);
  // });
  // User.beforeUpdate(async (user, options) => {
  //   console.log("使用者即將更新", user.toJSON());
  //   // 密碼hash處理
  //   const salt = await bcrypt.genSalt(10);
  //   user.passhash = await bcrypt.hash(user.passhash, salt);
  // });
  // // 保存後事件處理
  // User.afterCreate((user, options) => {
  //   console.log("使用者已經創建", user.toJSON());
  // });

  User.login = async function (username, passhash) {
    const user = await this.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      const auth = await bcrypt.compare(passhash, user.passhash);
      if (auth) {
        return user;
      }
      throw Error("密碼錯誤");
    }
    throw Error("查無此使用者");
  };

  User.check = async function (userid, oldPasshash) {
    const user = await this.findOne({
      where: { id: userid },
    });
    const auth = await bcrypt.compare(oldPasshash, user.passhash);
    if (auth) {
      return true;
    }
    throw Error("舊密碼錯誤");
  };

  return User;
};
