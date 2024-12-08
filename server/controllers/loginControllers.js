
const { raw } = require("mysql");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
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
  logging: console.log,
});

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const UserModle = require("../../models/user");
const User = UserModle(sequelize, Sequelize);
const jwt = require("jsonwebtoken");

// 錯誤處理
const handleErrors = (err) => {
  const errors = { username: "", passhash: "", email: "" };

  if (err.message === "查無此使用者") {
    errors.username = "此帳號尚未註冊";
  }

  if (err.message === "密碼錯誤") {
    errors.passhash = "重新輸入密碼";
  }

  if (err.message === "舊密碼錯誤") {
    errors.oldPasshash = "舊密碼錯誤請重新輸入";
  }

  // 驗證錯誤並回傳相應訊息
  if (err.message.includes("Validation error")) {
    err.errors.forEach((errorItem) => {
      const { path, message } = errorItem;
      errors[path] = message;
    });
  }
  console.log(errors);
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: maxAge,
  });
};

exports.signup_get = (req, res) => {
  res.render("signup");
};

exports.login_get = (req, res) => {
  res.render("login");
};

exports.signup_post = async (req, res) => {
  const { username, passhash, first_name, last_name, phone, email, address } =
    req.body;

  try {
    const hashedPassword = await hashPassword(passhash);
    const user = await User.create({
      username,
      passhash: hashedPassword,
      first_name,
      last_name,
      phone,
      email,
      address,
    });
    const userData = await User.findOne({
      where: { username: user.username },
    });
    const token = createToken(userData.id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: userData.id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

exports.login_post = async (req, res) => {
  const { username, passhash } = req.body;
  try {
    const user = await User.login(username, passhash);
    const isMatch = await bcrypt.compare(passhash, user.passhash);
    if (!isMatch) throw Error("密碼錯誤");
    const token = createToken(user.id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user.id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  req.session.user = null;
  res.redirect("/index");
};

exports.userPage = (req, res) => {
  res.render("userPage");
};

exports.reset_get = (req, res) => {
  res.render("reset");
};

exports.reset_post = (req, res) => {
  const { oldPasshash, newPasshash } = req.body;
  const token = req.cookies.jwt;
  jwt.verify(token, JWT_SECRET, async (err, decodeddToken) => {
    if (err) {
      return res.status(401).json({ error: "JWT 驗證失敗，請重新登入" });
    }
    if (!token) {
      return res.status(401).json({ error: "請先登入後再嘗試" });
    }
    try {
      const check = await User.check(decodeddToken.id, oldPasshash);
      const hashedNewPassword = await hashPassword(newPasshash);
      if (check) {
        await User.update(
          {
            passhash: hashedNewPassword,
          },
          {
            where: { id: decodeddToken.id },
            validate: true,
            individualHooks: true,
          }
        );
        res.cookie("jwt", "", { maxAge: 1 });
        const token = createToken(decodeddToken.id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

        res.status(200).json({ message: "密碼重設成功" });
      }
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json(errors);
    }
  });
};
