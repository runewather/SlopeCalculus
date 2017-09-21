var express         = require("express");
var path            = require("path");
var logger          = require("morgan");
var cookieParser    = require("cookie-parser");
var bodyParser      = require("body-parser");
var nodemailer      = require("nodemailer");
var session         = require("express-session");
var expressValidator= require("express-validator");
var passport        = require("passport");
var LocalStrategy   = require("passport-local");
var multer          = require("multer");
var upload          = multer({dest:'./uploads'});
var flash           = require("connect-flash");
var mongo           = require("mongodb");
var mongoose        = require("mongoose");

//var routes = require('./routes/index');
//var users  = require('./routes/users');

mongoose.connect('mongodb://localhost/slope');
var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    name: {
       type: String,
       index: true
    },
    email: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    }
});

var UserCreator = mongoose.model('users', UserSchema); 

function createUser(newUser, callback)
{
    newUser.save(callback);
}

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator());

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('/', function(req, res){
    res.render('index', {'a': 'batata'});
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function(req, res){
    var user = {
        name : req.body.name,
        email : req.body.email,
        username: req.body.username,
        password: req.body.password
    }
    UserCreator.create(user, function(err, user){
        console.log(err);
    });
    
    res.location('/');
    res.redirect('/');
});

app.listen(3000, function(req, res){
    console.log("Server is running on 3000...");
});