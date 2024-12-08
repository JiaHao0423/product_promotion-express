require("dotenv").config({ debug: true });
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: "mysql",
  host: DB_HOST,
  port: DB_PORT,
  dialectOptions: {
    connectTimeout: 60000,
  },
  pool: {
    max: 15,
    min: 5,
    idle: 20000,
    evict: 15000,
    acquire: 30000,
  },
});
const UserModel = require("../models/user");
const User = UserModel(sequelize, Sequelize);

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // 檢查是否有JWT
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodeddToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodeddToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = async (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decodeddToken = await jwt.verify(token, JWT_SECRET);

      const user = await User.findOne({ where: { id: decodeddToken.id } });

      if (user) {
        res.locals.user = user.dataValues;
        req.session.user = user.dataValues;
      } else {
        console.error("Database query error:", err.message);
        res.locals.user = null;
      }
    } catch (err) {
      console.error("JWT verification or Database query error:", err.message);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};

module.exports = { requireAuth, checkUser };
