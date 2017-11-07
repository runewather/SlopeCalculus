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
var flash           = require("connect-flash");
var mongo           = require("mongodb");
var mongoose        = require("mongoose");
var md5             = require('md5');

mongoose.connect('mongodb://localhost/slope');
var db = mongoose.connection;

var img;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../SlopeCalculus/public/uploads')
    },
    filename: function (req, file, cb) {
        var name = file.originalname;
        var ext = name.slice(name.lastIndexOf('.'), name.length); 
        var hash = md5(name + Date.now());
        cb(null, hash + ext);
        img = "uploads/" + hash + ext;  
        console.log(img);
    }
  });
  
var upload = multer( { storage: storage } );

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

var QuestionSchema = mongoose.Schema({
    subject: {
       type: String,
       index: true
    },
    statement: {
        type: String
    },
    c1: {
        type: String
    },
    c2: {
        type: String
    },
    c3: {
        type: String
    },
    c4: {
        type: String
    },
    correct: {
        type: String
    }
});

var User = mongoose.model('users', UserSchema); 
var Question = mongoose.model('questions', QuestionSchema);

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
    res.render('index');
});

app.get('/logado', function(req, res){
    res.render('logado');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.get('/register_question', function(req, res){
    res.render('register_question');
});

app.post('/login', function(req, res){
    User.findOne({ username: req.body.username}, function (err, doc){
        if(doc && doc.password == req.body.password)
        {
            var i = 0;                
            var r = [];
            Question.find({}, function(err, docs){
                docs.forEach(function(doc)
                {
                    r[i] = doc;                        
                    i++;
                });
                var random = Math.floor(Math.random() * i);
                res.render('logado', { username : doc.username, statement : r[random].statement, 
                c1 : r[random].c1, c2 : r[random].c2, c3 : r[random].c3, c4 : r[random].c4 });                      
            });            
        }
        else
        {
            res.render('login', { msg : "Usuario ou senha errado!"});
        }        
      });
});

app.post('/register_question', upload.single('img'),function(req, res){
    var question = {
        statement : img,
        c1 : req.body.c1,
        c2 : req.body.c2,
        c3 : req.body.c3,
        c4 : req.body.c4,
        correct : req.body.correct
    }
    Question.create(question, function(err, user){
        console.log(err);
    });
    res.redirect('/');
});

app.post('/register', function(req, res){
    var user = {
        name : req.body.name,
        email : req.body.email,
        username: req.body.username,
        password: req.body.password
    }
    User.create(user, function(err, user){
        console.log(err);
    });
    
    res.location('/');
    res.redirect('/');
});

app.listen(3000, function(req, res){
    console.log("Server is running on 3000...");
});