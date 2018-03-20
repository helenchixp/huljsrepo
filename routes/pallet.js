var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //change [templete] to new name.
  res.render('pallet', { title: 'Pallet', message: 'This is Pallet!!!!!' });
});

module.exports = router;
