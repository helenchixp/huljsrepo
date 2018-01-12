/**
 * http://mongodb.github.io/node-mongodb-native/3.0/tutorials/
 * $ npm install mongodb@2.2.34 --save               
 * + mongodb@2.2.34  
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var db;

// Connection URL
const url = 'mongodb://127.0.0.1:27017/hulagent';

// Database Name
const dbName = 'hulagent';

var mongoconn = function(colname, params, next) {
  MongoClient.connect(url, function(err, db) {
     assert.equal(null, err);
     console.log("Connected correctly to server" + typeof(db));
     var colls = db.db(dbName).collection(colname); 
     console.log('    '+colls);
     next(db);
       
     
  });
};


var collection = function(name) {
   
  var colname = name;

  return {
     find: function(params, callback) {
        mongoconn(colname, params, function(db) {
             db.collection(name).find({}).toArray(function(err, result) { 
                console.log('  .......  '+name + '  '  + result );
                callback(result);
                db.close();
             } );
        });
     }
  };


}

module.exports = collection;


/*
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, client) {
   assert.equal(null, err);
   console.log("Connected correctly to server");
   db = client.db(dbName);
  
   find(db, function() {
     client.close();
   });
});

var find = function(db, callback) {
   var collection = db.collection('agent');
   var result = collection.find().toArray(err, docs);
   console.log(result);
 
};

module.exports = find;
*/
/*
var collection = function(name) {
  console.log('collection name:' + name + db.getCollectionNames());     
  return db.collection(name);
}

module.exports = collection;
*/
