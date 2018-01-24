var express = require('express');
var router = express.Router();
var dbquery = require('./dbquery.js');
var sendlog= dbquery('hulsndlog.db');
var url = require('url');
const URL = 'sendlog';

var agentid;

/* GET logs data. */
var showlogs = function(req, res) {
  var params = url.parse(req.url, true);
  var pageid = parseInt(params.query.pageid) ? parseInt(params.query.pageid) : 0; 
  var sql = 'select seqno, id, hostname, startday, starttime, endday, endtime, ' +
            'returncode, refercode, filename_utf8, records, junction_type ' + 
            'from sendlog ' +
            'order by endday desc, endtime desc ' +
            'limit 10 offset ' + pageid *10 + ';'; 
  var sumsql = 'select count(*) from sendlog;';
  
    

  var result = sendlog.getList(sumsql, sql, function(sum, rows) {
             res.render(URL, { 
                    title : '配信履歴', 
                    agentid : agentid,
                    loginuser : req.session.user,  
                    searchurl : URL,
                    loglen : sum,
                    pageid : pageid,
                    logs : rows
               });
  });
};

/* DELETE logs by seqno */
var deletelogs = function(seqnos) {
  if(!seqnos || seqnos.length <= 0 )
     throw new Error('The seqno is Null');

  var delsql = 'delete from sendlog where seqno = $seqno;';
  var delsqlslave = 'delete from sendlog_slave where seqno_slave = $seqno;';
  var delsqljob = 'delete from sendjoblog where seqno = $seqno';
  var sqls = [];

  seqnos.forEach(function(val, index) {
    sqls.push( {
      sql : delsql,
      params : { $seqno : val }
    });
    sqls.push( {
      sql : delsqlslave,
      params : { $seqno : val }  
    });
    sqls.push( {
      sql : delsqljob,
      params : { $seqno : val }
    });
  });

  console.log(' ....... ' + sqls.count);

  sendlog.serializeRun(sqls);  
  
};

/* GET home page. */
router.get('/', function(req, res, next) {
   showlogs(req, res);
});
router.get('/:agentid', function(req, res, next) {
  if(req.params.agentid) {
     agentid = req.params.agentid;
  }
   showlogs(req, res);
});
router.post('/', function(req, res, next) {
  if(req.body.action === 'DEL') {

    console.log(' ..... ' + req.body.action+ ' .... ' + req.body.clogs);
    var delprm = new Promise( function(resolve, reject) { 
       deletelogs(req.body.clogs);
       resolve(true);
    });

    delprm.then(function(result) {
      if(result)
        showlogs(req, res);
    }).catch(function(err) {
      throw err;
    });
  } 
  else {
    showlogs(req,res);
  }
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
