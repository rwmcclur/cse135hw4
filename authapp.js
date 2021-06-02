const express = require("express");
const app = express();

app.use(express.static(__dirname));

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

const Schema = mongoose.Schema;
const UserDetail = new Schema({
  username: String,
  password: String
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

app.post('/login', (req, res, next) => {
    passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }
  /*
      if (!user) {
        return res.redirect('login');
      }
  */
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        
        return res.redirect('home');
      });
  
    })(req, res, next);
});



app.get('/logout', function(req,res){
    req.logout();
    res.redirect('login');
})

app.get('/home', function(req, res){
  res.sendFile('home.html', { root: __dirname });
});

/*
app.get('/home', connectEnsureLogin.ensureLoggedIn(), function(req, res){
    res.sendFile('home.html', { root: __dirname });
});
*/
app.get('/reports', connectEnsureLogin.ensureLoggedIn(), function(req, res) {
    res.sendFile('reports.html', { root: __dirname });
});

app.listen(port);

//UserDetails.register({username:'bob', active: false}, 'bob');
