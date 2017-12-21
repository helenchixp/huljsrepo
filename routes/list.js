var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('list', {title: 'List!!'});
});

router.post('/', function(req, res) {
  //Link to List Page
  res.render('list', { title: '管理者ページ', message: '件数：100件' });
  //res.send('LIST!!!');
  console.log('LIST LIST');
});

module.exports = router;
