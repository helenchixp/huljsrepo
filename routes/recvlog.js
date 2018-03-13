var express = require('express');
var router = express.Router();
var dbquery = require('./dbquery.js');
var recvlog= dbquery('hulrcvlog.db');
var url = require('url');
const URL = 'recvlog';

var showlogs = function(req, res, next) {
   var params = url.parse(req.url, true);
   var pageid = parseInt(params.query.pageid) ?  parseInt(params.query.pageid) : 0;

  var sql = 'select id, hostname, startday, starttime, endday, endtime, ' +
            'returncode, refercode, filename_utf8, records, junction_type ' +
            'from recvlog ' +
            'order by endday desc, endtime desc ' +
            'limit 10 offset ' + pageid * 10 + ';'; 
  var sumsql = 'select count(*) from recvlog;';
    
  recvlog.getList(sumsql, sql, {}, function(sum, rows)  {
       res.render(URL, { 
                 title : '集信履歴', 
                 searchurl : URL,
                 loginuser : req.session.user,  
                 loglen : sum,
                 pageid : pageid,
                 logs : rows
               });
     });
     /*
  var result = recvlog.query(sql,[], function(rows) {
    res.render(URL, { 
                 title : '集信履歴', 
                 searchurl : URL,
                 loginuser : req.session.user,  
                 logs : rows
               });
  });
    */
}
router.get('/', function(req, res, next) {
  showlogs(req, res, next);
});
router.post('/', function(req, res, next) {
  showlogs(req, res, next);
});


module.exports = router;
