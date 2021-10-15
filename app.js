const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs"); 

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/newWikiDB', {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

///////////////////////Requests Targetting All Articles/////////////////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})

.post(function(req, res){

  const title = req.body.title;
  const content = req.body.content;

  const newArticle = new Article({
    title: title,
    content: content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully saved the new article.");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Article.deleteMany({}, function(err){
    if(!err){
      res.send("Successfully deleted all the articles");
    }
  });
});

///////////////////////Requests Targetting A Specific Article/////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){

  const articleTitle  = req.params.articleTitle;

  Article.findOne({title: articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle)
    }else{
      res.send("Match not found");
    }
  });
})

.put(function(req, res){

  const articleTitle  = req.params.articleTitle;
  Article.findOneAndUpdate(
    {title: articleTitle},
    {
      title: req.body.title,
      content: req.body.content
    },
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the article");
      }
    }
  );
})

.patch(function(req, res){

const articleTitle  = req.params.articleTitle;

Article.findOneAndUpdate(
  {title: articleTitle},
  {$set: req.body},
  function(err){
    if(!err){
      res.send("Successfully updated the article")
    }else{
      res.send(err);
    }
  }
);
})

.delete(function(req, res){
  const articleTitle  = req.params.articleTitle;

  Article.deleteOne({title: articleTitle}, function(err){
    if(!err){
      res.send("Successfully deleted the article");
    }else{
      res.send(err);
    }
  });
});

// const HTML = new Article({
//   title: "HTML",
//   content: "The HyperText Markup Language, or HTML is the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies such as Cascading Style Sheets and scripting languages such as JavaScript. "
// });
//
// HTML.save();

app.listen(3000, function(req, res){
  console.log("Server started on port 3000");
});
