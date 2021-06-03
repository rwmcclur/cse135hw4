const express = require("express");
const app = express();

//app.use(express.static(__dirname));

const bodyParser = require('body-parser')
const expressSession = require('express-session')({
  secret: 'chonky',
  resave: false,
  saveUninitialized: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

const port = 3003;



const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/AuthApp',
  { useNewUrlParser: true, useUnifiedTopology: true });


var db = mongoose.connection;

const Schema = mongoose.Schema;
const UserDetail = new Schema({
  username: String,
  password: String,
  isAdmin: Boolean
});

UserDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');


passport.use(UserDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());



const connectEnsureLogin = require('connect-ensure-login');



app.get('/login', function(req,res) {
    res.sendFile('login.html', {root: __dirname});
});


app.post('/login', passport.authenticate('local',
    {successRedirect: 'home', failureRedirect: 'login'}
), function(req, res){
});

app.get('/test', function(req,res){
  res.sendFile('test.html', { root: __dirname });
});

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('login');
})


app.get('/home', connectEnsureLogin.ensureLoggedIn(), function(req, res){
    res.sendFile('home.html', { root: __dirname });
});


//ALERT: ADD IN ADMIN CHECK!!!!
app.get('/users', connectEnsureLogin.ensureLoggedIn(), function(req, res) {
  let lazyAdminCheck = req.user.username;
  if(lazyAdminCheck == 'admin'){
    res.sendFile('users.html', { root: __dirname });
  } else { res.redirect('home') }
  
});


/*
app.get('/userTable', connectEnsureLogin.ensureLoggedIn, function(req, res){
  

  UserDetails.find({}, function(err, docs){
    if(!err){
      console.log(docs);
    }
  });
  
  
    
});
*/


app.listen(port);

//UserDetails.register({username:'admin', active: false}, 'admin');
