var express = require('express');
var router = express.Router();
var util = require('./utility');
/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.destroy();
  global.env.loginUser = '';
  console.log('deleted session');
  res.redirect('/');
});
 
module.exports = router;
