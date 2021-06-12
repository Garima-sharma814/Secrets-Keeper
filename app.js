require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportlocalmongoose = require("passport-local-mongoose");

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'idk what',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/secretsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportlocalmongoose)

const User = new mongoose.model("user", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// All get requests
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secrets", (req,res)=>{
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/login");
  }
});
app.get("/logout", (req,res)=>{
  req.logout();
  res.redirect("/");
})


// All post requests
app.post("/register",(req,res)=>{
  User.register({username: req.body.username}, req.body.password, (err, user)=>{
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req, res, ()=>{
        res.redirect("/secrets");
      })
    }
  })
});

app.post("/login", (req,res)=>{
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, (err)=>{
    if(!err){
      console.log(err);
      res.resdirect("/login");
    }else[
      passport.authenticate("local")(req, res, ()=>{
        res.redirect("/secrets");
      })
    ]
  })
});



// Server
app.listen(port, (req, res) => {
  console.log(`server is running at port http://${hostname}:${port}/`);
});
