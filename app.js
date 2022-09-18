require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);


const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/logout", function(req, res) {
  res.render("home");
});

app.post("/register", function(req, res) {
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const pwd = req.body.password;
  User.findOne({
      email: username
    }, function(err, user) {
      if (!user) {
        res.render("register");
      } else {
        if (pwd === user.password) {
          res.render("secrets");
        } else {
          res.render("login");
        }
      }
      });
});



app.listen(3000, function() {
  console.log("Server up and running on port 3000");
})
