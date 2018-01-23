var express = require('express');
var router = express.Router();
var dbquery = require('./dbquery.js');
var sendlog= dbquery('hulsndlog.db');
var url = require('url');
const URL = 'sendlog';

/* GET logs data. */
var showlogs = function(req, res) {
  var params = url.parse(req.url, true);
  var pageid = parseInt(params.query.pageid) ? parseInt(params.query.pageid) : 0; 
  var sql = 'select id, hostname, startday, starttime, endday, endtime, ' +
            'returncode, refercode, filename_utf8, records, junction_type ' + 
            'from sendlog ' +
            'order by endday desc, endtime desc ' +
            'limit 10 offset ' + pageid *10 + ';'; 
  var sumsql = 'select count(*) from sendlog;';

  var result = sendlog.getList(sumsql, sql, function(sum, rows) {
             res.render(URL, { 
                    title : '配信履歴', 
                    agentid : req.params.agentid,
                    loginuser : req.session.user,  
                    searchurl : URL,
                    loglen : sum,
                    pageid : pageid,
                    logs : rows
               });
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
   showlogs(req, res);
});
router.get('/:agentid', function(req, res, next) {
   showlogs(req, res);
});
router.post('/', function(req, res, next) {
  console.log(' ..... ' + req.body.searchid);
  showlogs(req,res);
});

/*
 * It is Old function
router.get('/', function(req, res, next) {

  var db = new sqlite3.Database('/home/guest01/hulft/hulft840/etc/hulsndlog.db', function(err) {
    if(err) {
      console.error(err.message);  
    } 

    console.log('-----Connected to the hulsndlog database.-----');
  });
  var sql = 'select id, hostname, startday, starttime, endday, endtime, ' +
            'returncode, refercode, filename_utf8, records, junction_type ' + 
            'from sendlog ' +
            'order by endday desc, endtime desc'
            ';';
  
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
*/
module.exports = router;
