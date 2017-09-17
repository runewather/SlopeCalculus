var express     = require("express");
var path        = require("path");
var bodyParser  = require("body-parser");
var nodemailer  = require("nodemailer");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    res.send("<h1>Hello World NodeJS!</h1>");
});

app.listen(3000, function(req, res){
    console.log("Server is running on 3000...");
});