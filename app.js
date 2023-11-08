const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");


app.engine("handlebars",exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "/public")));
app.get("/",(req, res) => {
    res.render("home")
});

app.get("/*",(req, res) =>{
    res.send("not found");
});
app.listen(8081,() => {
    console.log("express app listening on 8081")
});