var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('Please wait....');
});

router.post('/', function(req, res) {
  console.log('   ....... add user....');

});

//var collection = require('./mongo');
/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('login', { title: '管理者ページ・ログイン' });
  // res.send('Login is Stopping!!');
});

*/
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
