var express = require('express');
var router = express.Router();
var dbquery = require('./dbquery.js');
var sendlog= dbquery('opl/huloplcmd.db');
const URL = 'opllog';

/* GET logs data. */
var showlogs = function(req, res) {
  var sql = 'select uid_os, prcday, prctime, startday, starttime, ' +
            'start_host, cmd_key, cmd_source, cmd_param ' + 
            'from oplcmd ' +
            'order by prcday desc, prctime desc ' +
            'limit 50' 
            ';';
  var result = sendlog.query(sql, function(rows) {
    res.render(URL, { 
                    title : '操作ログ', 
                    agentid : req.params.agentid,
                    searchurl : URL,
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


module.exports = router;
