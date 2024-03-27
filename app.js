const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware')



app.use(express.urlencoded({ extended: true }));

// 設置handlebars模板引擎
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// 伺服器設置
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/image/:imageName', (req, res) => {
  const { imageName } = req.params;
  res.sendFile(path.join(__dirname, 'public', imageName));
});



app.get('*',checkUser)
const productRoutes = require('./server/routes/product');
app.use('/', productRoutes);
const loginRoutes = require('./server/routes/login');
app.use('/', loginRoutes);






app.get("/*", (req, res) => {
  res.send("not found");
});
app.listen(8081, () => {
  console.log("express app listening on 8081")
});