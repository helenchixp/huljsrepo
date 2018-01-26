var sqlite3 = require('sqlite3').verbose();

var dbquery = function(dbname) {
  var _dbname = '/home/guest01/hulft/hulft840/etc/' + dbname;

  var dbconn = function() {
    console.log('DBName: [' + _dbname + ']');
    var db = new sqlite3.Database(_dbname, function(err) {
      if(err) {
        console.error(err.message);
        throw err;
      }
    });

    return db;
  };



  return {
    serializeRun: function(sqls, callback) {
      if(sqls) {
        db = dbconn();
        db.serialize(function() {
           sqls.forEach(function(val, index) {
              db.run(val.sql, val.params);    
           });  
          console.log(' --serializeRun--FINISH------'); 
        });
      }   
    },
    getList: function(sumsql, sql , params,  callback) {
       console.log('_____________search params:__________ : ' ,  params);
       console.log(' SQL:[' + sql + ']' );
       console.log(' SUM SQL:[' + sumsql + ']' );
       var db = dbconn();
       db.serialize(function() {   
        var sumprm = new Promise(function(resolve, reject) {
          db.get(sumsql, params ,function(err,res) {
            if(err) reject(err);
            resolve(res['count(*)']);
          });
        }); 
        sumprm.then(function(sum) {
          db.all(sql, params ,function(err,rows) {
            if(err) throw err;
            callback(sum, rows);
          }); 
        }).catch(function(err) {
          console.log(err);
          throw err;
        }).then(function() {
          db.close();
          console.log('DB is closed;'); 
        }) ; 

        //callback(sum,rows);
      });
    },
    serialize: function(next, isclose) {
       var db = dbconn();
       db.serialize(function() {

         next(db);

       });
       console.log('isclose :' + isclose);
       if(isclose)
         db.close();
    },

    query: function(sql, params , callback) {
      //var result = null;
      var db = dbconn();
      db.all(sql, params, function(err, rows) {
        if(err) throw err;
        console.log(' SQL:[' + sql + ']' );
        callback(rows);
      });
      db.close(function(err) {
        if(err) throw err;
      });

      //return result;
    },
    first: function(sql, params, callback) {
      var db = dbconn();
      db.get(sql, params, function(err, row) {
        if(err) throw err;
        console.log(' SQL(first):[ '+ sql + ' ]');
        //return row;
        callback(row);
      });
      db.close(function(err) {
        console.log('... first method close');
        if(err) throw err;
      });
    }
    // todo: it is will be transcation. 
    /* 
    firstAsync : function(sql, params) { 
      return new Promise(function(resolve, reject) {
        var db = dbconn();

        db.serialize(function() {
          db.get(sql, params, function(err, row) {
            if(err) reject(err);
            resolve(row);  
          });
        });
        db.close(function(err) {
          console.log(' .... first Async is over.');
        });

      });
    } */
    /*
    firstAsync : function(sql, params, callback) {
      return new Promise(function (resolve, reject) {
          return resolve('test!!!');
      });
    }
  */
  };
};

module.exports = dbquery;
