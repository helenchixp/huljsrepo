var express = require('express');
var router = express.Router();
//var objectID = require('mongodb').ObjectID;
var collection = require('./mongo');
var utility = require('./utility');
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
router.get('/', utility.loginCheck, function(req, res, next) {

    console.log(' global.env = %s ', global.env);

  collection('agent').find({}, function(docs) {
     res.render(URL, {
                title: 'エージェント一覧',
                searchurl: URL,
                //env: global.env,
                loginuser : req.session.user,
                agents: docs
            });
  });
});

router.post('/', function(req, res) {
  //Link to List Page
   collection('agent').find({}, function(docs) {   
      res.render(URL, { 
                title: 'エージェント一覧', 
                searchurl: URL,
                env: global.env,                
                agents: docs
            });
  });
});

module.exports = router;
