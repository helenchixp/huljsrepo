var express = require('express');
var router = express.Router();
var dbquery = require('./dbquery.js');
var recvlog= dbquery('hulrcvlog.db');

router.get('/', function(req, res, next) {
  var sql = 'select id, hostname, startday, starttime, endday, endtime, ' +
            'returncode, refercode, filename_utf8, records, junction_type ' +
            'from recvlog ' +
            'order by endday desc, endtime desc;'
  var result = recvlog.query(sql, function(rows) {
    
    res.render('recvlog', { title : '集信履歴 実装中 ', logs : rows});
  });

});

module.exports = router;
