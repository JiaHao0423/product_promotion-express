const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");


const productData = require('./data/product.js');



// 連接mysql
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('productpromotion', 'root', '0000', {
  dialect: 'mysql',
  host: 'localhost'
});
// 是否連接成功
sequelize.authenticate()
  .then(() => {
    console.log('成功連接資料庫');
  })
  .catch(err => {
    console.error('連接資料庫失敗', err);
  });


// 設置handlebars模板引擎
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// 設置靜態文件目錄
app.use(express.static(path.join(__dirname, "/public")));

app.get('/image/:imageName', (req, res) => {
  const { imageName } = req.params;
  res.sendFile(path.join(__dirname, 'public', imageName));
});


// index渲染
app.get("/index", async (req, res) => {
  res.render("index");
});

// 分頁查詢渲染

const Product = require('./models').Product;

app.get('/product', async function (req, res) {

  let page = req.query.page;
  let limit = parseInt(req.query.limit);
  const offset = (page - 1) * limit;
  let title = ""
  switch (page) {
    case "1":
      title = "顯示卡"
      break;
    case "2":
      title = "硬碟"
      break;
    case "3":
      title = "鍵盤/滑鼠"
      break;
    case "4":
      title = "記憶卡"
      break;
    case "5":
      title = "螢幕"
      break;
    default:
      title = "主機"
  }
  const data = await Product.findAll({
    offset: offset,
    limit: limit,
    raw: true
  });
  console.log(title);
  res.render('pagination', { data: data, title: title });
});


// 單一商品頁面
app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  
  productData.then((data) => {
    res.render("product", { data: data[id - 1] });
  }).catch((error) => {

  });

});

// 從資料庫提取商品資料
app.get('/productData', async (req, res) => {
  // 使用Sequelize獲取資料
  const productsData = await sequelize.query('SELECT * FROM product');
  // 發送數據到請求方
  res.send(productsData);
});

app.get("/*", (req, res) => {
  res.send("not found");
});
app.listen(8081, () => {
  console.log("express app listening on 8081")
});