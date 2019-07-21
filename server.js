var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var exphbs = require("express-handlebars");

var db = require("./models");

var PORT = 3000;

var app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.get("/", function(req, res) {
    res.render("index");
  });


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });