var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //change [templete] to new name.
  res.render('templete', { title: 'Templete', message: 'This is Templete!!!!!' });
});

module.exports = router;
