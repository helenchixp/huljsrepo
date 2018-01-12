var express = require('express');
var router = express.Router();
var objectID = require('mongodb').ObjectID;
var collection = require('./mongo');
const URL = 'list'

/*
// For Cross Origin
router.all('/*', function(req, res, next) {
  res.contentType( 'json' );
  res.header( 'Access-Control-Allow-Origin', '*' );
  next();
}); 
*/

/* GET home page. */
router.get('/', function(req, res, next) {

  collection('agent').find({}, function(docs) {
   // res.send(docs);
     res.render(URL, {
                title: '未ログイン・エージェント一覧',
                searchurl: URL,
                agents: docs
            });
  });
  /*
  res.render(URL, {
                title: '未ログイン・エージェント一覧',
                searchurl: URL
            });
  */
});

router.post('/', function(req, res) {
  //Link to List Page
   collection('agent').find({}, function(docs) {   
      res.render(URL, { 
                title: 'エージェント一覧', 
                //message: '件数：100件',
                searchurl: URL,
                agents: docs,
                loginuser: req.body.username
            });
  });
});

module.exports = router;
