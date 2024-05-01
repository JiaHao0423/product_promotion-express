var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');
var { requireAuth, checkUser } = require('./middleware/authMiddleware')
var session = require('express-session');



app.use(express.urlencoded({ extended: true }));




// 設置handlebars模板引擎
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// 伺服器設置
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "shop-secret",
  resave: false,
  saveUninitialized: true
}))


app.get('/image/:imageName', (req, res) => {
  var { imageName } = req.params;
  res.sendFile(path.join(__dirname, 'public', imageName));
});



app.get('*', checkUser)
var productRoutes = require('./server/routes/product');
app.use('/', productRoutes);
var loginRoutes = require('./server/routes/login');
app.use('/', loginRoutes);
var cartRoutes = require('./server/routes/cart');
app.use('/', cartRoutes);






app.get("/*", (req, res) => {
  res.send("not found");
});
app.listen(8081, () => {
  console.log("express app listening on 8081")
});


