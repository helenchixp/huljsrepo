var express = require('express');
var router = express.Router();
var dbquery = require('./dbquery.js');
var recvlog= dbquery('hulrcvlog.db');
const URL = 'recvlog';

router.get('/', function(req, res, next) {
  var sql = 'select id, hostname, startday, starttime, endday, endtime, ' +
            'returncode, refercode, filename_utf8, records, junction_type ' +
            'from recvlog ' +
            'order by endday desc, endtime desc;'
  var result = recvlog.query(sql, function(rows) {
    
    res.render(URL, { 
                 title : '集信履歴', 
                 searchurl : URL,
                 logs : rows
               });
  });

});

module.exports = router;
