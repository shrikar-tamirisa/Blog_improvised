require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');


const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.set("strictQuery", false);

const connectDB = async ()=>{
   try{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected")
   }
   catch(err){
      process.exit(1);
   }
}


const blog_doc = mongoose.model('blog_doc', { title: String, content:String});
const poem_doc = mongoose.model('poem_doc', { title: String, content:String});




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
  blog_doc.find({}, function(err, results){
    if(err){
      console.log(err);
    }
    else{
      res.render("home", {arr: results});
    }
  })

});

app.get("/contact", function(req,res){
  res.render("contact");
})

app.get("/poems", function(req,res){
  poem_doc.find({}, function(err, results){
    if(err){
      console.log(err);
    }
    else{
      res.render("poems", {arr: results});
    }
  })
})

app.get("/compose", function(req,res){
  res.render("compose");
})

app.get("/poem_comp", function(req,res){
  res.render("poem_comp");
})

app.post("/compose_poem", function(req,res){
  let ip_title = req.body.ip_title;
  let ip_body = req.body.ip_body;
  
  let obj = new poem_doc({title:ip_title, content:ip_body});
  obj.save();
  res.redirect("/poems");
})

app.post("/compose", function(req,res){
  let ip_title = req.body.ip_title;
  let ip_body = req.body.ip_body;

  let obj = new blog_doc({title:ip_title, content:ip_body});
  obj.save();
  res.redirect("/");
})


app.get("/posts/:day_ip", function(req,res){
  
  blog_doc.find({}, function(err, results){
    if(err){
      console.log(err);
    }
    else{
      for(var i=0;i < results.length;i++){
        if(_.lowerCase(req.params.day_ip) === _.lowerCase(results[i].title)){
          res.render("post", {title:results[i].title, para:results[i].content});
          break;
        }
      }
    }
  })
})

app.get("/login", function(req,res){
  res.render("login");
})

app.post("/login", function(req,res){
  if(req.body.passcode === "333"){
    res.render("compose_opt");
  }
  else{
    res.render("failpg");
  }
})

app.get("/comp_opt", function(req,res){
  res.render("compose_opt");
})

connectDB().then(() => {
app.listen(PORT, function() {
  console.log("Server started");
})}
);
