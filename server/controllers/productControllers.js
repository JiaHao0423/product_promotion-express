// 連接mysql
const { Sequelize, where } = require("sequelize");

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

const ProductModel = require("../../models/product");
const Product = ProductModel(sequelize, Sequelize);

//首頁商品列表渲染
exports.view = (req, res) => {
  Product.findAll()
    .then((products) => {
      const data = products.map((product) => product.dataValues);
      res.render("index", {
        rows1: data.slice(0, 8),
        rows2: data.slice(8, 16),
        rows3: data.slice(16, 24),
        rows4: data.slice(24, 32),
        rows5: data.slice(32, 40),
        rows6: data.slice(40, 48),
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};

//查詢渲染
exports.find = (req, res) => {
  const searchText = req.body.search;

  Product.findAll({
    where: {
      name: {
        [sequelize.Sequelize.Op.like]: "%" + searchText + "%",
      },
    },
  })
    .then((products) => {
      const data = products.map((product) => product.dataValues);
      res.render("search", { data: data });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};

// 分頁查詢渲染
exports.pagination = (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.limit) || 8;
  const offset = (page - 1) * limit;
  let title = "";

  switch (page) {
    case "1":
      title = "顯示卡";
      break;
    case "2":
      title = "硬碟";
      break;
    case "3":
      title = "鍵盤/滑鼠";
      break;
    case "4":
      title = "記憶卡";
      break;
    case "5":
      title = "螢幕";
      break;
    case "6":
      title = "主機";
      break;
    default:
      title = "顯示卡";
  }
  Product.findAll({
    limit: limit,
    offset: offset,
  })
    .then((products) => {
      const data = products.map((product) => product.dataValues);
      res.render("pagination", { data: data, title: title });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};

//單一產品頁
exports.product = (req, res) => {
  const id = req.params.id;

  Product.findOne({
    where: { id: id },
  })
    .then((product) => {
      if (!product) {
        return res.status(404).send("Product not found");
      }
      res.render("product", { data: product.dataValues });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};
