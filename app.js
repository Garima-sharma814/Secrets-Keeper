require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
// const encrypt = require(mongoose-encryption);
const md5= require("md5");  // for hashing the password 

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/secretsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret,excludeFromEncryption: ['password'] });  //ecyption package to user Schema

const User = new mongoose.model("user", userSchema);


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


// All post requests
app.post("/register",(req,res)=>{
    const NewUser = new User({
        email: req.body.username,
        password: md5(req.body.password)  //hashing the password of the user 
    });
    NewUser.save((err)=>{
        if(err){
            console.log(err)
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login", (req,res)=>{
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, (err, foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});



// Server
app.listen(port, (req, res) => {
  console.log(`server is running at port http://${hostname}:${port}/`);
});
