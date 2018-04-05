var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //change [templete] to new name.
  res.render('summary', { title: 'Summary', message: 'This is Summary!!!!!' });
});

/* PUT JSON_? */
router.put('/update', function(req, res, next) {
    console.log(req.body);
    // resopnse will be return JSON
    res.end(JSON.stringify({"test": "hoge"}));
});

module.exports = router;
