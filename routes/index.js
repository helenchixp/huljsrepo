var express = require('express');
var router = express.Router();
var utility = require('./utility');

/*
var loginCheck = function(req, res, next) {
    if(req.session.user) {
      next();
      //res.redirect('/list'); 
    } else {
      //next()
      res.redirect('login');
    }
};
*/

/* GET home page. */
router.get('/',utility.loginCheck, function(req, res, next) {
    res.render('index', { title: 'Express Test' });
});

/* add the post */
router.post('/', function(req, res) {
  console.log(' ------' + req.body.name);
  res.render('index', { title: 'Express Posted :' + req.body.name });
});
module.exports = router;
