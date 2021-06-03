var express = require('express');
var mongoose = require('mongoose');
const port = 3004;
var app = express();

mongoose.connect('mongodb://localhost/AuthApp');
var db = mongoose.connection;
var Document = null;

db.on('error', console.error.bind(console, 'Connection error:'));



app.get('/userTable', connectEnsureLogin.ensureLoggedIn, function(req, res){
      db.collection('userInfo').find({}).toArray(function(err,docs){
      res.send(docs);

/*
  let lazyAdminCheck = req.user.username;
  if(lazyAdminCheck == 'admin'){
    db.collection('userInfo').find({}).toArray(function(err,docs){
      res.send(docs);
    });

  });
  } else { res.redirect('home') }
  */
});




app.listen(port);