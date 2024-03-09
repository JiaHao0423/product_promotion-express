const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");


app.use(express.urlencoded({ extended: true }));

// 設置handlebars模板引擎
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// 設置靜態文件目錄
app.use(express.static(path.join(__dirname, "/public")));

app.get('/image/:imageName', (req, res) => {
  const { imageName } = req.params;
  res.sendFile(path.join(__dirname, 'public', imageName));
});


const productRoutes = require('./server/routes/product');
app.use('/', productRoutes);


app.get("/*", (req, res) => {
  res.send("not found");
});
app.listen(8081, () => {
  console.log("express app listening on 8081")
});