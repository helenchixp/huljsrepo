var express = require('express');
var router = express.Router();
const URL = 'list'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(URL, {
                title: '未ログイン・エージェント一覧',
                searchurl: URL
            });
});

router.post('/', function(req, res) {
  //Link to List Page
  res.render(URL, { 
                title: 'エージェント一覧', 
                //message: '件数：100件',
                searchurl: URL
            });
});

module.exports = router;
