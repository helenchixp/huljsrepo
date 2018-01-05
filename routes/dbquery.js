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
    query: function(sql, callback) {
      var result = null;
      var db = dbconn();
      db.all(sql, [], function(err, rows) {
        if(err) throw err;
        console.log(' SQL:[' + sql + ']' );
        callback(rows);
      });
      db.close(function(err) {
        if(err) throw err;
      });

      return result;
    }
  };
};

module.exports = dbquery;
