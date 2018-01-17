var express = require('express');
var router = express.Router();
//var collection = require('./mongo');
var model = require('./userModel');
var User = model.User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: '管理者ページ・ログイン' });
});

router.post('/', function(req, res) {
  var query = {
    username : req.body.username,
    password : req.body.password
  };
  User.find(query, function(err,data) {
    if(err) throw err;
    if(data.length === 0 ) {
      res.render('login', {    
          title: '管理者ページ・ログイン',
          message : 'ユーザ名・パスワードは不正です。' 
      });
    } else {
       req.session.user = req.body.username;
       res.redirect('/list');
    }

  });

});
/*
router.post('/', function(req, res, next) {
  collection('user').find({
      username : req.body.username,
      password : req.body.password
  }, function(docs) {
    if(docs.length > 0) {
      res.redirect('/list');
    } else {

      res.render('login', { 
          //title: 'Login', 
          title: '管理者ページ・ログイン',
          message : 'ユーザ名・パスワードは不正です。'
      });
    }
  });
});
*/ 
module.exports = router;
