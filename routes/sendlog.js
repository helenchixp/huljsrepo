var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
/*
var db = new sqlite3.Database('/home/guest01/hulft/hulft840/etc/hulsndlog.db', function(err) {
  if(err) {
    console.error(err.message);
  } 
  console.log('Connected to the chinook database.');
});
*/
/* GET home page. */
router.get('/', function(req, res, next) {

  var db = new sqlite3.Database('/home/guest01/hulft/hulft840/etc/hulsndlog.db', function(err) {
    if(err) {
      console.error(err.message);  
    } 

  console.log('-----Connected to the hulsndlog database.-----');});
  var sql = 'select id, hostname, startday, starttime, endday, endtime, ' +
            'returncode, refercode, filename_utf8, records, junction_type ' + 
            'from sendlog ' +
            'order by endday desc, endtime desc'
            ';';
  
  /*
  db.each(sql, function(err, row) {
    if(err) {
      throw err;
    }
    console.log(row.id + ' : ' + row.returncode);
  });
  */
  db.all(sql, [], function(err, rows) {
    if(err) throw err;
    console.log('-------Query the table-------');
    console.log('SQL:['+sql+']');

    //Show html page
    res.render('sendlog', { title: '配信履歴', logs: rows });
  });

  db.close(function(err) {
    if(err) throw err;
    console.log('-----Close the database connection-----');
  });
  

});

module.exports = router;
