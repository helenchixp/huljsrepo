var express = require('express');
var router = express.Router();

var objectID = require('mongodb').ObjectID;
var mongo = require('./mongo');

/* GET users listing. */
router.get('/', function(req, res, next) {
   var collection = mongo('agent');
   collection.find([], function(docs) {
     res.send(docs[1].name);
   });  
});

module.exports = router;
