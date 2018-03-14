var express = require('express');
var router = express.Router();

var objectID = require('mongodb').ObjectID;
var mongo = require('./mongo');
const URL = 'users';


/* GET users listing. */
router.get('/', function(req, res, next) {
   var collection = mongo('user');
   collection.find({}, function(docs) {
     res.render(URL, {
            title: 'User List',
            searchurl: URL,
            users: docs,
         });
   });  
});


/* Search User ID */
/*
router.post('/', function(req, res) {

    console.log('POST UUID'+req.body.uuids);


    mongo('users').find({}, function(docs) {
        res.render(URL, {
            title: 'User List',
            searchurl: URL,
            users: docs,
        });
    });
});
*/

/* Delete Users */
router.post('/del', function(req, res) {

    var filter = {};

    var uuids = req.body.uuids;
    if(Array.isArray(uuids)) {
      var objectids = [];  
      uuids.forEach(function(val, index) {
          //console.log( 'UUID %s = %s', index,val);
          objectids.push(new objectID(val));
      });
      filter = {
          _id : {
            $in: objectids
        }
      }
    }
    else {
      filter = {
          _id : new objectID(req.body.uuids)
      };  
    }

    console.log( filter );

    var collection = mongo('user');  
        
    collection.deleteMany( filter, function(err, r) {
        if(err) {
        } else {
        res.redirect('../' + URL);
        }
    });
});

/* Find and Update  */
router.post('/detail', function(req, res) {

    var collection = mongo('user');  
    if(req.body.hide_id)
    {
        collection.findOneAndUpdate(
            {_id: new objectID(req.body.hide_id)},
            {
                username : req.body.username,
                password : req.body.password
            },
            function(err, result) {

                res.redirect('../' + URL);
            });
    }
    else {
        collection.insertOne(
            {
                username : req.body.username,
                password : req.body.password
            },
            function(err, result) {
                res.render('templete', {
                    title : "TODO: /users/detail"
                });
            });
    }

});

module.exports = router;
