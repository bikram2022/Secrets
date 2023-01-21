require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");
const { env } = require("process");
mongoose.set("strictQuery", false);

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.render("secrets");
          }
          else{
            console.log("Wrong password");
          }
        });
      } else {
        console.log("User not found");
      }
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    let user = new User({
      email: req.body.username,
      password: hash,
    });
    user.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
