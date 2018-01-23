var express = require('express');
var router = express.Router();
var dbquery = require('./dbquery.js');
var url = require('url');
var opllog= dbquery('opl/huloplcmd.db');
const URL = 'opllog';

/* GET logs data. */
var showlogs = function(req, res) {
   var params = url.parse(req.url, true);
   var pageid = parseInt(params.query.pageid) ?  parseInt(params.query.pageid) : 0;

   var sql = 'select uid_os, prcday, prctime, startday, starttime, ' +
            'start_host, cmd_key, cmd_source, cmd_param ' + 
            'from oplcmd ' +
            'order by prcday desc, prctime desc ' +
            'limit 10 offset ' + pageid * 10
            ';';
    var sumsql = 'select count(*) from oplcmd';

    console.log(sql);
    opllog.serialize(function(db) {
      var sumprm = new Promise(function(resolve, reject) {
        db.get(sumsql, function(err, res) {
           resolve( res['count(*)']);
        });
      });
      sumprm.then(function( sum ) {
        console.log( typeof sum );
        db.all(sql, function(err, rows) {
           if(err) throw err;
           res.render(URL, {
                    title : '操作ログ' ,
                    agentid : req.params.agentid,     
                    searchurl : URL,
                    loginuser : req.session.user,
                    loglen : sum,
                    pageid : pageid,
                    logs : rows
              }); 
        });
        db.close();

      }).catch(function(err) {
         throw err;
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
  showlogs(req, res);
});


module.exports = router;
