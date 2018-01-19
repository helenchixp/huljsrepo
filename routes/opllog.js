var express = require('express');
var router = express.Router();
var dbquery = require('./dbquery.js');
var url = require('url');
var sendlog= dbquery('opl/huloplcmd.db');
const URL = 'opllog';

/* GET logs data. */
var showlogs = function(req, res) {
   var params = url.parse(req.url, true);
   console.log('....... + req.query.id:' + params.query.id);
   var sql = 'select uid_os, prcday, prctime, startday, starttime, ' +
            'start_host, cmd_key, cmd_source, cmd_param ' + 
            'from oplcmd ' +
            'order by prcday desc, prctime desc ' +
            'limit 10 offset 10 '
            ';';
/*
   var sqlc = 'select count(*) as sum from oplcmd;';
   
   sendlog.firstAsync(sqlc,[]).then(function(result) {
      console.log(' Count :[' + result['count(*)'] ); 
   }).catch(function(err) {
      console.log(err);
   });
*/
   /*
   var count = sendlog.firstAsync('select count(*) from oplcmd;',[], function(row) {
       console.log('0000000 -> '+row);
       this.logcount = row;
       return row;
    });
*/
  /* 
    var promise = new Promise(function(resolve, reject) {
        try {
           var result = sendlog.first('select count(*) as sum from oplcmd;',[], function(row) {
             console.log('*******1 rows.length : ' + row.sum );
             if(row) 
               return resolve(row);
             else
               return reject('unknown count' + row);
           });
           resolve(result);
        } catch (err) {
          reject(err);
        } 
    });
    promise.then(function(result) {

       console.log('  ****** 2 then' + result);
       var result = sendlog.query(sql,[], function(rows) {
       res.render(URL, { 
                    title : '操作ログ', 
                    agentid : req.params.agentid,
                    searchurl : URL,
                    logs : rows
               });

    }).catch(function(err) {
        console.log(' ???? Failure:', err);
    });
*/
    console.log('******* ->  -->> ' );     
    
    var result = sendlog.query(sql,[], function(rows) {
    res.render(URL, { 
                    title : '操作ログ', 
                    agentid : req.params.agentid,
                    searchurl : URL,
                    loginuser : req.session.user,
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
