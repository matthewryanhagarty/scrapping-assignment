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
// app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var db = require("./models");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


    
app.get("/scrape", function(req, res) {

    axios.get("https://blog.feedspot.com/music_blogs/").then(function(response) {

        var $ = cheerio.load(response.data);
        
        $("a.tlink").each(function(i, element) {

            var result = {};
        
            result.title = $(element).text();
            result.link = $(element).attr("href");
    

            db.Article.create(result)
            .then(function(dbArticle) {
            // console.log(dbArticle);
            })
            .catch(function(err) {
            console.log(err);
            });
        }) 
          res.json("Scrape Complete")
        
        })
});

app.get("/", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {

        res.render("home", {
          articles: dbArticle
        })
      })
      .catch(function(err) {
        // res.json(err);
      });
  });


  app.get("/saved", function(req, res) {
    db.Article.find({})
    .populate("note")
      .then(function(dbArticle) {
        res.render("saved", {
          articles: dbArticle
        })
      })
      .catch(function(err) {
        res.json(err);
      });
  });


// app.get("/articles/:id", function(req, res) {
//     db.Article.findOne({ _id: req.params.id })
//       .populate("note")
//       .then(function(dbArticle) {
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         res.json(err);
//       });
//   });

  app.post("/articles/:id/note", function(req, res) {
   
    db.Note.create(req.body)
      .then(function(dbNote) {
    
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });


  app.put("/articles/:id", function(req, res) {

    db.Article.findOneAndUpdate({_id: req.params.id}, req.body)
    .then(function(response) {
      res.json(true)
    })
    .catch(function(err) {
      console.log(err)
    })

  })


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });