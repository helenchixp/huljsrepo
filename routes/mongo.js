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
     next(db);
  });
};


var collection = function(name) {
   
    var colname = name;

    return {
        find: function(params, callback) {
            mongoconn(colname, params, function(db) {
                db.collection(name).find(params).toArray(function(err, result) { 
                    console.log('  .......  colname : '+name + '  docs count:'  + result.length );
                    callback(result);
                    db.close();
                } );
            });
        },
        deleteMany: function(params, callback) {
            mongoconn(colname, params, function(db) {
                db.collection(name).deleteMany(params, function(err, result) {
                    console.log(' collection Name : %s  Delete docs count: %d', name, result.length);
                    callback(err, result);
                    db.close();
                });
            });
        },
        findOneAndUpdate: function(findparams, updatedata ,callback) {
            mongoconn(colname, findparams, function(db) {
                db.collection(name).findOneAndUpdate(
                        findparams,
                        updatedata,
                        {},
                        function(err, result) {
                            console.log('find :' + findparams + ' Update:' + updatedata);
                            callback(err, result);
                            db.close();
                        }
                );
            });
        },
        insertOne: function(params, callback) {
             mongoconn(colname, params, function(db) { 
                 db.collection(name).insertOne(params, function(err, result) {
                     console.log('insert :' + params + ' ____' );
                     callback(err, result);
                     db.close();
                 });
             });
        }
    }
};

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
