var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Test' });
});

/* add the post */
router.post('/', function(req, res) {
  console.log(' ------' + req.body.name);
  res.render('index', { title: 'Express Posted :' + req.body.name });
});
module.exports = router;
